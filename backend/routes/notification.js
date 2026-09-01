import express from 'express';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * GET /api/notifications
 * Get user notifications (mock userId for now)
 */
router.get('/', async (req, res) => {
  try {
    // For demo purposes, use a fixed user email or get from query params
    const userEmail = req.query.email || 'user@example.com';
    
    // Find user by email
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      // Return empty notifications for non-existent users
      return res.json({
        success: true,
        notifications: [],
        unreadCount: 0
      });
    }

    // Get notifications for this user
    const notifications = await Notification.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({ 
      userId: user._id, 
      isRead: false 
    });

    res.json({
      success: true,
      notifications: notifications.map(n => ({
        id: n._id,
        type: n.type,
        title: n.title,
        message: n.message,
        jobId: n.jobId,
        jobTitle: n.jobTitle,
        company: n.company,
        isRead: n.isRead,
        createdAt: n.createdAt,
        timeAgo: getTimeAgo(n.createdAt)
      })),
      unreadCount
    });

  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

/**
 * PUT /api/notifications/:id/read
 * Mark notification as read
 */
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      notification
    });

  } catch (error) {
    console.error('Mark Read Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
});

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read
 */
router.put('/read-all', async (req, res) => {
  try {
    const userEmail = req.query.email || 'user@example.com';
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await Notification.updateMany(
      { userId: user._id, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Mark All Read Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 */
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted'
    });

  } catch (error) {
    console.error('Delete Notification Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
});

/**
 * POST /api/notifications/create
 * Create a notification (and optionally send email)
 */
router.post('/create', async (req, res) => {
  try {
    const { userEmail, type, title, message, jobId, jobTitle, company, sendEmail } = req.body;

    // Find user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create notification
    const notification = await Notification.create({
      userId: user._id,
      type,
      title,
      message,
      jobId,
      jobTitle,
      company,
      emailSent: false
    });

    // Send email if requested
    if (sendEmail) {
      await sendNotificationEmail(user.email, notification);
      notification.emailSent = true;
      await notification.save();
    }

    res.json({
      success: true,
      notification,
      message: 'Notification created successfully'
    });

  } catch (error) {
    console.error('Create Notification Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification'
    });
  }
});

/**
 * Send notification email via Brevo
 */
async function sendNotificationEmail(userEmail, notification) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!brevoApiKey || !brevoSenderEmail) {
    console.error('Brevo credentials not configured');
    return;
  }

  try {
    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: 'AI Job Portal Notifications',
          email: brevoSenderEmail
        },
        to: [{ email: userEmail }],
        subject: notification.title,
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .content {
                background: #f8f9fa;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .notification-box {
                background: white;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #667eea;
                margin: 20px 0;
              }
              .button {
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                margin-top: 20px;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #e9ecef;
                color: #6c757d;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0;">🔔 New Notification</h1>
            </div>
            
            <div class="content">
              <div class="notification-box">
                <h2 style="color: #667eea; margin-top: 0;">${notification.title}</h2>
                <p style="font-size: 16px; color: #333;">${notification.message}</p>
                
                ${notification.jobTitle ? `
                  <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e9ecef;">
                    <p style="margin: 5px 0;"><strong>Job Title:</strong> ${notification.jobTitle}</p>
                    ${notification.company ? `<p style="margin: 5px 0;"><strong>Company:</strong> ${notification.company}</p>` : ''}
                  </div>
                ` : ''}
              </div>
              
              <p style="text-align: center;">
                <a href="http://localhost:5173/user" class="button">
                  View Dashboard
                </a>
              </p>
            </div>
            
            <div class="footer">
              <p><strong>AI Job Portal</strong></p>
              <p>This is an automated notification. You can manage your notification preferences in your dashboard.</p>
            </div>
          </body>
          </html>
        `
      })
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error('Brevo Email Error:', errorData);
    } else {
      console.log('Notification email sent successfully to:', userEmail);
    }
  } catch (error) {
    console.error('Send Email Error:', error);
  }
}

/**
 * Helper function to get time ago string
 */
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval}${unit.charAt(0)} ago`;
    }
  }

  return 'Just now';
}

export default router;
