package com.trippilot.controller;

import com.trippilot.model.Booking;
import com.trippilot.repository.BookingRepository;
import com.trippilot.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private com.trippilot.service.SmsService smsService;

    // POST /api/bookings
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        if (booking.getDestination() == null || booking.getDestination().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Destination is required.");
        }

        if ((booking.getUserPhone() == null || booking.getUserPhone().trim().isEmpty()) &&
            (booking.getUserEmail() == null || booking.getUserEmail().trim().isEmpty())) {
            return ResponseEntity.badRequest().body("Mobile number or Email is required.");
        }

        if (booking.getUserEmail() == null || booking.getUserEmail().trim().isEmpty()) {
            booking.setUserEmail(booking.getUserPhone() + "@trippilot.com");
        }

        // Generate Booking Reference Number if not present
        if (booking.getBookingReference() == null || booking.getBookingReference().isEmpty()) {
            int randomNo = 100000 + new Random().nextInt(900000);
            booking.setBookingReference("TP-" + randomNo);
        }

        // Calculate Duration in Days & Nights if arrival and departure dates are present
        if (booking.getArrivalDate() != null && booking.getDepartureDate() != null && booking.getDurationDays() == null) {
            try {
                LocalDate arrival = LocalDate.parse(booking.getArrivalDate());
                LocalDate departure = LocalDate.parse(booking.getDepartureDate());
                long days = ChronoUnit.DAYS.between(arrival, departure);
                if (days <= 0) days = 1;
                booking.setDurationDays((int) days);
                booking.setDurationNights((int) Math.max(1, days - 1));
            } catch (Exception e) {
                booking.setDurationDays(3);
                booking.setDurationNights(2);
            }
        }

        // Default trip type if not specified
        if (booking.getTripType() == null || booking.getTripType().isEmpty()) {
            if (booking.getDestination().toLowerCase().contains("ski") || booking.getDestination().toLowerCase().contains("gulmarg") || booking.getDestination().toLowerCase().contains("solang") || booking.getDestination().toLowerCase().contains("manali")) {
                booking.setTripType("Ski & Snowboard Expedition");
            } else {
                booking.setTripType("Indian Heritage & Nature Tour");
            }
        }

        // Default price in Rupees if not specified
        if (booking.getTotalPrice() == null || booking.getTotalPrice().isEmpty()) {
            booking.setTotalPrice("₹18,500");
        }

        booking.setUserEmail(booking.getUserEmail().toLowerCase());
        Booking savedBooking = bookingRepository.save(booking);

        // Send Real Mobile Phone SMS Confirmation Message
        try {
            smsService.sendBookingConfirmationSms(savedBooking);
        } catch (Exception e) {
            System.err.println("SMS notification error: " + e.getMessage());
        }

        // Send Email Confirmation Notification (if valid email present)
        try {
            if (savedBooking.getUserEmail() != null && !savedBooking.getUserEmail().endsWith("@trippilot.com")) {
                emailService.sendBookingConfirmationEmail(savedBooking);
            }
        } catch (Exception e) {
            System.err.println("Email notification error: " + e.getMessage());
        }

        return ResponseEntity.ok(savedBooking);
    }

    // GET /api/bookings
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // GET /api/bookings/user/{email}
    @GetMapping("/user/{email}")
    public List<Booking> getBookingsByUser(@PathVariable String email) {
        return bookingRepository.findByUserEmail(email.toLowerCase());
    }
}

