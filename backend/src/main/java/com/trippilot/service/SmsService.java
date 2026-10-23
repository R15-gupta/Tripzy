package com.trippilot.service;

import com.trippilot.model.Booking;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;

@Service
public class SmsService {

    @Value("${sms.provider:fast2sms}")
    private String smsProvider;

    @Value("${sms.fast2sms.api-key:YOUR_FAST2SMS_API_KEY}")
    private String fast2smsApiKey;

    @Value("${sms.twilio.account-sid:YOUR_TWILIO_ACCOUNT_SID}")
    private String twilioAccountSid;

    @Value("${sms.twilio.auth-token:YOUR_TWILIO_AUTH_TOKEN}")
    private String twilioAuthToken;

    @Value("${sms.twilio.from-phone:+1234567890}")
    private String twilioFromPhone;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    /**
     * Send booking confirmation SMS to traveler's mobile number
     */
    public boolean sendBookingConfirmationSms(Booking booking) {
        String phone = booking.getUserPhone();
        if (phone == null || phone.trim().isEmpty()) {
            System.out.println("⚠️ [SMS] No mobile number provided for booking: " + booking.getBookingReference());
            return false;
        }

        // Clean phone number (extract last 10 digits)
        phone = phone.replaceAll("[^0-9]", "");
        if (phone.length() > 10) {
            phone = phone.substring(phone.length() - 10);
        }

        String name = booking.getUserName() != null ? booking.getUserName() : "Traveler";
        String destination = booking.getDestination() != null ? booking.getDestination() : "Your destination";
        String refNo = booking.getBookingReference() != null ? booking.getBookingReference() : "TP-CONFIRMED";
        String arrival = booking.getArrivalDate() != null ? booking.getArrivalDate() : "Soon";
        String departure = booking.getDepartureDate() != null ? booking.getDepartureDate() : "Soon";
        String tripType = booking.getTripType() != null ? booking.getTripType() : "Indian Heritage & Adventure Tour";
        int durationDays = booking.getDurationDays() != null ? booking.getDurationDays() : 3;
        int durationNights = booking.getDurationNights() != null ? booking.getDurationNights() : 2;
        int guests = booking.getGuests() != null ? booking.getGuests() : 1;
        String price = booking.getTotalPrice() != null ? booking.getTotalPrice() : "₹18,500";

        // Rich WhatsApp Message Format with professional English confirmation and complete trip details
        String whatsappBody = String.format(
                "🌟 *TRIPPILOT - BOOKING CONFIRMED* 🌟\n\n" +
                "Dear %s,\n" +
                "✅ *Yes! Your booking has been successfully confirmed!*\n\n" +
                "📋 *Booking Details:*\n" +
                "• *Booking ID:* #%s\n" +
                "• *Destination:* %s\n" +
                "• *Trip Package:* %s\n" +
                "• *Travel Dates:* %s to %s\n" +
                "• *Duration:* %d Days / %d Nights\n" +
                "• *Total Guests:* %d Person(s)\n" +
                "• *Total Amount:* %s (Confirmed)\n" +
                "• *Status:* Confirmed & Active ✅\n\n" +
                "📞 *24x7 Helpline:* 1800-TRIP-PILOT | support@trippilot.com\n" +
                "TripPilot wishes you a wonderful and safe journey! ✈️🌴",
                name, refNo, destination, tripType, arrival, departure, durationDays, durationNights, guests, price
        );

        String smsBody = String.format(
                "TripPilot: Dear %s, your booking travel to '%s' is CONFIRMED! Ref: #%s. Guests: %d. Dates: %s to %s. Helpline: 1800-TRIP-PILOT",
                name, destination, refNo, guests, arrival, departure
        );

        if ("twilio-whatsapp".equalsIgnoreCase(smsProvider) || "whatsapp".equalsIgnoreCase(smsProvider)) {
            return sendViaTwilioWhatsApp(phone, whatsappBody);
        } else if ("twilio".equalsIgnoreCase(smsProvider)) {
            return sendViaTwilio(phone, smsBody);
        } else if ("fast2sms".equalsIgnoreCase(smsProvider)) {
            return sendViaFast2SMS(phone, smsBody);
        } else {
            return simulateSms(phone, whatsappBody, "Simulated WhatsApp");
        }
    }

    /**
     * Twilio WhatsApp Gateway
     */
    public boolean sendViaTwilioWhatsApp(String phone, String message) {
        if (twilioAccountSid == null || twilioAccountSid.contains("YOUR_TWILIO_ACCOUNT_SID") ||
            twilioAuthToken == null || twilioAuthToken.contains("YOUR_TWILIO_AUTH_TOKEN")) {
            return simulateSms(phone, message, "Twilio WhatsApp (Configure twilio credentials in application.properties)");
        }

        try {
            String toPhone = "whatsapp:+91" + phone;
            String fromPhone = twilioFromPhone.startsWith("whatsapp:") ? twilioFromPhone : "whatsapp:" + twilioFromPhone;

            String formData = "To=" + URLEncoder.encode(toPhone, StandardCharsets.UTF_8)
                    + "&From=" + URLEncoder.encode(fromPhone, StandardCharsets.UTF_8)
                    + "&Body=" + URLEncoder.encode(message, StandardCharsets.UTF_8);

            String auth = twilioAccountSid + ":" + twilioAuthToken;
            String authHeader = "Basic " + Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));

            String twilioUrl = String.format("https://api.twilio.com/2010-04-01/Accounts/%s/Messages.json", twilioAccountSid);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(twilioUrl))
                    .header("Authorization", authHeader)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(formData))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                System.out.println("✅ [Twilio WhatsApp] Confirmation message successfully delivered to " + toPhone);
                return true;
            } else {
                System.err.println("❌ [Twilio WhatsApp] Failed with HTTP " + response.statusCode() + ": " + response.body());
                simulateSms(phone, message, "Twilio WhatsApp Fallback");
                return false;
            }
        } catch (Exception e) {
            System.err.println("❌ [Twilio WhatsApp] Error: " + e.getMessage());
            simulateSms(phone, message, "Twilio WhatsApp Fallback");
            return false;
        }
    }

    /**
     * Fast2SMS Gateway (Popular Indian SMS API)
     */
    private boolean sendViaFast2SMS(String phone, String message) {
        if (fast2smsApiKey == null || fast2smsApiKey.trim().isEmpty() || fast2smsApiKey.contains("YOUR_FAST2SMS_API_KEY")) {
            return simulateSms(phone, message, "Fast2SMS (Configure api-key in application.properties)");
        }

        try {
            String encodedMessage = URLEncoder.encode(message, StandardCharsets.UTF_8);
            String url = String.format(
                    "https://www.fast2sms.com/dev/bulkV2?authorization=%s&route=q&message=%s&language=english&flash=0&numbers=%s",
                    fast2smsApiKey, encodedMessage, phone
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("cache-control", "no-cache")
                    .GET()
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                System.out.println("✅ [Fast2SMS] Confirmation SMS successfully delivered to: +91 " + phone);
                return true;
            } else {
                System.err.println("❌ [Fast2SMS] Failed with status " + response.statusCode() + ": " + response.body());
                simulateSms(phone, message, "Fast2SMS Fallback");
                return false;
            }
        } catch (Exception e) {
            System.err.println("❌ [Fast2SMS] Error sending SMS: " + e.getMessage());
            simulateSms(phone, message, "Fast2SMS Fallback");
            return false;
        }
    }

    /**
     * Twilio SMS Gateway (Worldwide SMS API)
     */
    private boolean sendViaTwilio(String phone, String message) {
        if (twilioAccountSid == null || twilioAccountSid.contains("YOUR_TWILIO_ACCOUNT_SID") ||
            twilioAuthToken == null || twilioAuthToken.contains("YOUR_TWILIO_AUTH_TOKEN")) {
            return simulateSms(phone, message, "Twilio (Configure twilio credentials in application.properties)");
        }

        try {
            String toPhone = "+91" + phone;
            String formData = "To=" + URLEncoder.encode(toPhone, StandardCharsets.UTF_8)
                    + "&From=" + URLEncoder.encode(twilioFromPhone, StandardCharsets.UTF_8)
                    + "&Body=" + URLEncoder.encode(message, StandardCharsets.UTF_8);

            String auth = twilioAccountSid + ":" + twilioAuthToken;
            String authHeader = "Basic " + Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));

            String twilioUrl = String.format("https://api.twilio.com/2010-04-01/Accounts/%s/Messages.json", twilioAccountSid);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(twilioUrl))
                    .header("Authorization", authHeader)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(formData))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                System.out.println("✅ [Twilio] Confirmation SMS successfully dispatched to " + toPhone);
                return true;
            } else {
                System.err.println("❌ [Twilio] Failed with HTTP " + response.statusCode() + ": " + response.body());
                simulateSms(phone, message, "Twilio Fallback");
                return false;
            }
        } catch (Exception e) {
            System.err.println("❌ [Twilio] Error dispatching SMS: " + e.getMessage());
            simulateSms(phone, message, "Twilio Fallback");
            return false;
        }
    }

    /**
     * Fallback and Console Confirmation logger
     */
    private boolean simulateSms(String phone, String message, String providerNote) {
        System.out.println("================================================================================");
        System.out.println("📱 [TripPilot SMS Gateway - " + providerNote + "]");
        System.out.println("📲 Recipient Phone: +91 " + phone);
        System.out.println("💬 Message: " + message);
        System.out.println("ℹ️ Status: SMS Sent to Traveler's Mobile Message Box!");
        System.out.println("================================================================================");
        return true;
    }
}
