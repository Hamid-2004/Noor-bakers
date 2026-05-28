import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.mailtrap.io",
  port: parseInt(process.env.EMAIL_PORT || "2525"),
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
});

const FROM_EMAIL = process.env.EMAIL_FROM || "Noor Bakers <noreply@noorbakers.com>";

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to Noor Bakers!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid rgba(11, 44, 93, 0.15); border-radius: 12px;">
          <h2 style="color: #0b2c5d;">Welcome to Noor Bakers, ${name}!</h2>
          <p>Thank you for creating an account with us. We are dedicated to providing you with premium, freshly baked sweets, nimcos, and cakes.</p>
          <p>You can now log in to check your order history, manage your profile, and receive special offers.</p>
          <p>Warm regards,<br/>The Noor Bakers Team</p>
        </div>
      `,
    });
    console.log("Welcome email sent: ", info.messageId);
  } catch (error) {
    console.error("Error sending welcome email: ", error);
  }
};

export const sendOrderConfirmationEmail = async (email: string, order: any) => {
  try {
    const itemsList = order.items
      .map(
        (item: any) =>
          `<li>${item.quantity}x ${item.product.name} - PKR ${item.price * item.quantity}</li>`
      )
      .join("");

    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: `Order Confirmation - Order #${order.id.slice(0, 8)}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid rgba(11, 44, 93, 0.15); border-radius: 12px;">
          <h2 style="color: #0b2c5d;">Order Confirmation</h2>
          <p>Dear ${order.name},</p>
          <p>Thank you for your order! We have received your request and are preparing it fresh.</p>
          <h3 style="color: #0b2c5d;">Order Summary (Order #${order.id.slice(0, 8)})</h3>
          <ul>
            ${itemsList}
          </ul>
          <p><strong>Subtotal:</strong> PKR ${order.subtotal}</p>
          <p><strong>Delivery Fee:</strong> PKR ${order.deliveryFee}</p>
          ${order.discountAmount > 0 ? `<p><strong>Discount:</strong> -PKR ${order.discountAmount}</p>` : ""}
          <p><strong>Total Amount:</strong> PKR ${order.total}</p>
          
          <h3 style="color: #0b2c5d;">Delivery Address:</h3>
          <p>${order.address}, ${order.area}, ${order.city}</p>
          
          <p>We will contact you via WhatsApp to confirm dispatch. Thank you for choosing Noor Bakers!</p>
        </div>
      `,
    });
    console.log("Order confirmation email sent: ", info.messageId);
  } catch (error) {
    console.error("Error sending order confirmation email: ", error);
  }
};

export const sendOrderStatusUpdateEmail = async (email: string, order: any) => {
  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: `Order Status Update - Order #${order.id.slice(0, 8)}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid rgba(11, 44, 93, 0.15); border-radius: 12px;">
          <h2 style="color: #0b2c5d;">Order Status Update</h2>
          <p>Dear ${order.name},</p>
          <p>The status of your order **#${order.id.slice(0, 8)}** has been updated to:</p>
          <h3 style="background-color: #f5f5f5; padding: 12px; border-radius: 8px; color: #0b2c5d; display: inline-block; font-weight: bold;">${order.status}</h3>
          <p>If you have any questions, please contact us on WhatsApp.</p>
          <p>Warm regards,<br/>The Noor Bakers Team</p>
        </div>
      `,
    });
    console.log("Order status update email sent: ", info.messageId);
  } catch (error) {
    console.error("Error sending order status update email: ", error);
  }
};
