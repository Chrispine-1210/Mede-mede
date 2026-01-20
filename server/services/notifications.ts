import { storage } from '../storage';

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE = process.env.TWILIO_PHONE;

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

// SMS notification via Twilio
export async function sendSMSNotification(
  phoneNumber: string,
  message: string,
  orderId?: string,
  userId?: string
) {
  try {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE) {
      console.warn('Twilio not configured');
      // Log notification locally
      if (userId) {
        await storage.logNotification({
          userId,
          orderId,
          type: 'sms',
          message,
          recipient: phoneNumber,
          status: 'pending',
        });
      }
      return;
    }

    const twilio = require('twilio');
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    const result = await client.messages.create({
      body: message,
      from: TWILIO_PHONE,
      to: phoneNumber,
    });

    if (userId) {
      await storage.logNotification({
        userId,
        orderId,
        type: 'sms',
        message,
        recipient: phoneNumber,
        status: 'sent',
        externalId: result.sid,
      });
    }

    return result;
  } catch (error) {
    console.error('SMS notification error:', error);
    if (userId) {
      await storage.logNotification({
        userId,
        orderId,
        type: 'sms',
        message,
        recipient: phoneNumber,
        status: 'failed',
      });
    }
    throw error;
  }
}

// Email notification via SendGrid
export async function sendEmailNotification(
  email: string,
  subject: string,
  message: string,
  orderId?: string,
  userId?: string
) {
  try {
    if (!SENDGRID_API_KEY) {
      console.warn('SendGrid not configured');
      // Log notification locally
      if (userId) {
        await storage.logNotification({
          userId,
          orderId,
          type: 'email',
          subject,
          message,
          recipient: email,
          status: 'pending',
        });
      }
      return;
    }

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@mede-mede.mw',
      subject,
      text: message,
      html: `<p>${message}</p>`,
    };

    const result = await sgMail.send(msg);

    if (userId) {
      await storage.logNotification({
        userId,
        orderId,
        type: 'email',
        subject,
        message,
        recipient: email,
        status: 'sent',
        externalId: result[0].messageId,
      });
    }

    return result;
  } catch (error) {
    console.error('Email notification error:', error);
    if (userId) {
      await storage.logNotification({
        userId,
        orderId,
        type: 'email',
        subject,
        message,
        recipient: email,
        status: 'failed',
      });
    }
    throw error;
  }
}

// Notify order status changes
export async function notifyOrderStatusChange(
  userId: string,
  orderId: string,
  status: string,
  phoneNumber?: string,
  email?: string
) {
  const statusMessages: Record<string, string> = {
    pending: 'Your order has been received and is being processed.',
    processing: 'Your order is being prepared for delivery.',
    assigned: 'A driver has been assigned to your delivery.',
    out_for_delivery: 'Your order is on the way!',
    completed: 'Your order has been delivered. Thank you for your purchase!',
    cancelled: 'Your order has been cancelled.',
  };

  const message = statusMessages[status] || `Your order status: ${status}`;
  const subject = `Order Update - Status: ${status}`;

  const promises = [];

  if (phoneNumber) {
    promises.push(
      sendSMSNotification(phoneNumber, message, orderId, userId).catch(e =>
        console.error('SMS failed:', e)
      )
    );
  }

  if (email) {
    promises.push(
      sendEmailNotification(email, subject, message, orderId, userId).catch(e =>
        console.error('Email failed:', e)
      )
    );
  }

  await Promise.all(promises);
}

// Notify low inventory
export async function notifyLowInventory(
  productId: string,
  productName: string,
  currentStock: number,
  adminEmail: string
) {
  const message = `Low inventory alert: ${productName} is running low (${currentStock} units remaining).`;
  const subject = `Low Inventory Alert: ${productName}`;

  try {
    await sendEmailNotification(adminEmail, subject, message);
  } catch (error) {
    console.error('Admin notification error:', error);
  }
}
