package com.trippilot.service;

import com.trippilot.model.Booking;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendBookingConfirmationEmail(Booking booking) {
        String recipientEmail = booking.getUserEmail();
        String name = booking.getUserName() != null ? booking.getUserName() : "Valued Traveler";
        String refNo = booking.getBookingReference() != null ? booking.getBookingReference() : "TP-" + System.currentTimeMillis() % 1000000;
        String durationStr = (booking.getDurationDays() != null && booking.getDurationDays() > 0) 
            ? booking.getDurationDays() + " Days / " + (booking.getDurationDays() > 1 ? (booking.getDurationDays() - 1) + " Nights" : "1 Day") 
            : "Custom Duration";
        String priceStr = booking.getTotalPrice() != null ? booking.getTotalPrice() : "₹18,500";
        String tripType = booking.getTripType() != null ? booking.getTripType() : "Ski & Snowboard Alpine Expedition";

        String subject = "🏔️ Booking Confirmed! Your Ski Trip to " + booking.getDestination() + " (Ref: " + refNo + ")";

        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 20px; color: #f8fafc; }
                    .container { max-width: 650px; background: #1e293b; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #334155; }
                    .header { background: linear-gradient(135deg, #0284c7 0%%, #38bdf8 100%%); color: #ffffff; padding: 30px 20px; text-align: center; }
                    .header h1 { margin: 0; font-size: 28px; letter-spacing: 1px; font-weight: 800; }
                    .header p { margin: 8px 0 0 0; font-size: 15px; opacity: 0.95; }
                    .content { padding: 30px; color: #e2e8f0; line-height: 1.6; }
                    .status-badge { background: #10b981; color: #ffffff; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 700; display: inline-block; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
                    .details-box { background: #0f172a; border-left: 5px solid #38bdf8; padding: 22px; border-radius: 10px; margin: 25px 0; border: 1px solid #1e293b; }
                    .details-box table { width: 100%%; border-collapse: collapse; }
                    .details-box td { padding: 10px 0; font-size: 15px; border-bottom: 1px solid #1e293b; }
                    .details-box td:last-child { border-bottom: none; }
                    .details-box td.label { font-weight: 600; color: #94a3b8; width: 45%%; }
                    .details-box td.val { font-weight: 700; color: #f8fafc; text-align: right; }
                    .inclusions-box { background: #1e293b; border: 1px dashed #38bdf8; padding: 20px; border-radius: 10px; margin: 20px 0; }
                    .inclusions-box h3 { margin-top: 0; color: #38bdf8; font-size: 18px; }
                    .inclusions-list { list-style: none; padding: 0; margin: 0; }
                    .inclusions-list li { padding: 8px 0; font-size: 14px; color: #cbd5e1; display: flex; align-items: center; }
                    .inclusions-list li span { margin-right: 10px; font-size: 18px; }
                    .footer { background: #090d16; color: #64748b; padding: 20px; text-align: center; font-size: 13px; border-top: 1px solid #1e293b; }
                    .btn-action { display: inline-block; background: #ffa500; color: #ffffff; font-weight: 700; padding: 12px 28px; text-decoration: none; border-radius: 30px; margin-top: 15px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🏔️ SKI TRIP BOOKING CONFIRMED</h1>
                        <p>TripPilot Alpine Travel Expedition — Pack Your Snow Gear!</p>
                    </div>
                    <div class="content">
                        <span class="status-badge">✅ BOOKING CONFIRMED</span>
                        <h2>Namaste / Dear %s,</h2>
                        <p>🎉 Your Ski Trip booking has been <strong>successfully confirmed</strong>! We are excited to welcome you to the snow-covered slopes.</p>
                        
                        <div class="details-box">
                            <h3 style="margin-top:0; color:#38bdf8;">📋 Trip Details & Itinerary Summary</h3>
                            <table>
                                <tr><td class="label">Booking Reference:</td><td class="val"><span style="color:#ffa500;">%s</span></td></tr>
                                <tr><td class="label">Package / Destination:</td><td class="val">%s</td></tr>
                                <tr><td class="label">Trip Type:</td><td class="val">%s</td></tr>
                                <tr><td class="label">Number of Guests:</td><td class="val">%d Guest(s)</td></tr>
                                <tr><td class="label">Start Date (Arrival):</td><td class="val">📅 %s</td></tr>
                                <tr><td class="label">End Date (Departure):</td><td class="val">📅 %s</td></tr>
                                <tr><td class="label">Total Duration:</td><td class="val">⏳ <strong>%s</strong></td></tr>
                                <tr><td class="label">Total Price:</td><td class="val"><strong style="color:#10b981; font-size:17px;">%s</strong></td></tr>
                            </table>
                        </div>

                        <div class="inclusions-box">
                            <h3>🎿 What's Included in Your Ski Trip:</h3>
                            <ul class="inclusions-list">
                                <li><span>🎿</span> Full Ski & Snowboard Equipment Rental (Skis, Boots, Poles, Helmet)</li>
                                <li><span>🎟️</span> Unlimited Cable Car Gondola Pass & Mountain Lift Access</li>
                                <li><span>⛷️</span> Daily Professional Alpine Ski Instructor & Snow Trail Guide</li>
                                <li><span>🏔️</span> Heated Snow Lodge Cabin Accommodation</li>
                                <li><span>☕</span> Complimentary Daily Hot Chocolate & Buffet Breakfast</li>
                                <li><span>🚑</span> 24/7 Mountain First Aid & Avalanche Safety Coverage</li>
                            </ul>
                        </div>

                        <p><strong>💡 Quick Traveler Tip:</strong> Please remember to carry thermal wear, waterproof gloves, UV sunglasses, and a valid photo ID for resort check-in.</p>

                        <p>If you have any questions or need special customisation, reply directly to this email or contact TripPilot Support.</p>
                        
                        <p>Wish you a thrilling and safe mountain adventure!</p>
                        <p>Warm regards,<br><strong>The TripPilot Team</strong><br>🌐 <a href="http://localhost:8080" style="color:#38bdf8;">www.trippilot.in</a></p>
                    </div>
                    <div class="footer">
                        &copy; 2026 TripPilot AI Travel Planner India. All rights reserved.<br>
                        Contact: support@trippilot.in | Helpline: +91 1800-TRIP-PILOT
                    </div>
                </div>
            </body>
            </html>
            """.formatted(name, refNo, booking.getDestination(), tripType, booking.getGuests(), booking.getArrivalDate(), booking.getDepartureDate(), durationStr, priceStr);

        // Attempt sending email via JavaMailSender
        if (mailSender != null) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setTo(recipientEmail);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);
                mailSender.send(message);
                System.out.println("✅ Ski Trip Confirmation Email sent successfully to: " + recipientEmail);
            } catch (MessagingException e) {
                System.err.println("⚠️ Could not send email via SMTP server: " + e.getMessage());
                printConsolePreview(recipientEmail, subject, name, refNo, booking, durationStr, priceStr);
            }
        } else {
            printConsolePreview(recipientEmail, subject, name, refNo, booking, durationStr, priceStr);
        }
    }

    private void printConsolePreview(String email, String subject, String name, String refNo, Booking booking, String duration, String price) {
        System.out.println("\n------------------ 📧 SKI TRIP EMAIL NOTIFICATION LOG ------------------");
        System.out.println("RECIPIENT EMAIL: " + email);
        System.out.println("SUBJECT: " + subject);
        System.out.println("TRAVELER NAME: " + name);
        System.out.println("BOOKING REF: " + refNo);
        System.out.println("DESTINATION: " + booking.getDestination());
        System.out.println("DATES: " + booking.getArrivalDate() + " TO " + booking.getDepartureDate() + " (" + duration + ")");
        System.out.println("GUESTS: " + booking.getGuests() + " | TOTAL PRICE: " + price);
        System.out.println("INCLUSIONS: Ski Rental + Gondola Pass + Certified Instructor + Heated Lodge Stay");
        System.out.println("-----------------------------------------------------------------------\n");
    }
}

