import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM || "noreply@gemessence.co.ke";

// Initialize Resend only if API key is available
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface OrderEmailData {
  to: string;
  orderNumber: string;
  customerName: string;
  total: string;
  currency: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: string;
  }>;
}

export async function sendOrderConfirmation(data: OrderEmailData): Promise<boolean> {
  if (!resend) {
    console.log("[Email] Resend not configured, skipping email notification");
    return false;
  }

  try {
    const itemsHtml = data.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.productName}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${item.unitPrice} ${data.currency}</td>
      </tr>
    `
      )
      .join("");

    await resend.emails.send({
      from: `Gemessence <${emailFrom}>`,
      to: data.to,
      subject: `Order Confirmed - #${data.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 8px; overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #800000, #C9A227); padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-family: Georgia, serif;">Gemessence</h1>
              <p style="margin: 10px 0 0; font-size: 14px; opacity: 0.9;">Where Craftsmanship Meets Digital Excellence</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <h2 style="color: #C9A227; margin-top: 0;">Thank You for Your Order!</h2>
              <p>Dear ${data.customerName},</p>
              <p>We're pleased to confirm your order. Your luxury jewelry is being prepared with care.</p>
              
              <!-- Order Details -->
              <div style="background-color: #2a2a2a; border-radius: 6px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #C9A227; margin-top: 0;">Order #${data.orderNumber}</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="border-bottom: 2px solid #C9A227;">
                      <th style="padding: 8px 0; text-align: left; color: #C9A227;">Item</th>
                      <th style="padding: 8px 0; text-align: center; color: #C9A227;">Qty</th>
                      <th style="padding: 8px 0; text-align: right; color: #C9A227;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>
                
                <div style="text-align: right; margin-top: 15px; padding-top: 15px; border-top: 1px solid #444;">
                  <strong style="font-size: 18px; color: #C9A227;">Total: ${data.total} ${data.currency}</strong>
                </div>
              </div>
              
              <p>You'll receive another email when your order ships with tracking information.</p>
              
              <p style="color: #888;">If you have any questions, please contact us at <a href="mailto:support@gemessence.co.ke" style="color: #C9A227;">support@gemessence.co.ke</a> or WhatsApp us at +254797534189.</p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #111; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p style="margin: 0;">© ${new Date().getFullYear()} Gemessence. All rights reserved.</p>
              <p style="margin: 5px 0 0;">Nairobi, Kenya</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`[Email] Order confirmation sent to ${data.to} for order ${data.orderNumber}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send order confirmation:", error);
    return false;
  }
}
