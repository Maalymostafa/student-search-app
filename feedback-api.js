// FEEDBACK API ENDPOINTS - Add these to your server.js

const fs = require('fs');
const path = require('path');

// Create feedback storage directory
const feedbackDir = path.join(__dirname, 'feedback-data');
if (!fs.existsSync(feedbackDir)) {
  fs.mkdirSync(feedbackDir);
}

// Helper function to save feedback to file (and database later)
function saveFeedbackToFile(type, data) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${type}-${timestamp}.json`;
  const filepath = path.join(feedbackDir, filename);
  
  const feedbackData = {
    id: Date.now().toString(),
    type: type,
    timestamp: new Date().toISOString(),
    data: data,
    status: 'new',
    response: null
  };
  
  fs.writeFileSync(filepath, JSON.stringify(feedbackData, null, 2));
  
  // Also append to master log
  const logFile = path.join(feedbackDir, 'all-feedback-log.txt');
  const logEntry = `${new Date().toISOString()} | ${type.toUpperCase()} | ${data.userType || 'unknown'} | ${data.subject || data.title || 'No subject'}\n`;
  fs.appendFileSync(logFile, logEntry);
  
  return feedbackData.id;
}

// Helper function to send WhatsApp notification (optional)
async function sendWhatsAppNotification(type, data) {
  try {
    // This would integrate with WhatsApp Business API
    // For now, just log the notification
    console.log(`📱 WhatsApp notification: New ${type} received`);
    console.log(`From: ${data.userName || 'Anonymous'} (${data.userType || 'Unknown'})`);
    console.log(`Subject: ${data.subject || data.title || 'No subject'}`);
    
    // TODO: Implement actual WhatsApp API call
    // const whatsappMessage = `🔔 تنبيه: رسالة جديدة في النظام\nالنوع: ${type}\nمن: ${data.userName || 'مجهول'}\nالموضوع: ${data.subject || 'بدون موضوع'}`;
    // await sendWhatsAppMessage(process.env.ADMIN_WHATSAPP, whatsappMessage);
    
  } catch (error) {
    console.error('WhatsApp notification failed:', error);
  }
}

// FEEDBACK API ENDPOINTS

// Submit general feedback/message
app.post('/api/feedback', async (req, res) => {
  try {
    const { type, userType, userName, userContact, subject, message, urgency } = req.body;
    
    // Validation
    if (!type || !userType || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'برجاء ملء جميع الحقول المطلوبة'
      });
    }
    
    // Sanitize inputs
    const feedbackData = {
      type: type.substring(0, 50),
      userType: userType.substring(0, 20),
      userName: (userName || '').substring(0, 100),
      userContact: (userContact || '').substring(0, 100),
      subject: subject.substring(0, 200),
      message: message.substring(0, 2000),
      urgency: urgency || 'medium',
      userAgent: req.get('User-Agent') || '',
      ip: req.ip || req.connection.remoteAddress || ''
    };
    
    // Save feedback
    const feedbackId = saveFeedbackToFile('feedback', feedbackData);
    
    // Send notification for urgent messages
    if (urgency === 'urgent' || urgency === 'high') {
      await sendWhatsAppNotification('feedback', feedbackData);
    }
    
    // Save to database if available
    if (db && dbType === 'supabase') {
      try {
        const { error } = await db.from('user_feedback').insert([{
          feedback_id: feedbackId,
          type: feedbackData.type,
          user_type: feedbackData.userType,
          user_name: feedbackData.userName,
          user_contact: feedbackData.userContact,
          subject: feedbackData.subject,
          message: feedbackData.message,
          urgency: feedbackData.urgency,
          status: 'new',
          created_at: new Date().toISOString()
        }]);
        
        if (error) console.log('Database save failed:', error);
      } catch (dbError) {
        console.log('Database save error:', dbError);
      }
    }
    
    res.json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.',
      feedbackId: feedbackId,
      estimatedResponse: urgency === 'urgent' ? 'خلال ساعة واحدة' : urgency === 'high' ? 'خلال 4 ساعات' : 'خلال 24 ساعة'
    });
    
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في إرسال الرسالة'
    });
  }
});

// Submit review/rating
app.post('/api/review', async (req, res) => {
  try {
    const { overallRating, usabilityRating, speedRating, reviewerName, reviewText, recommendation } = req.body;
    
    if (!overallRating || overallRating < 1 || overallRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'برجاء إعطاء تقييم صحيح من 1 إلى 5'
      });
    }
    
    const reviewData = {
      overallRating: parseInt(overallRating),
      usabilityRating: parseInt(usabilityRating) || 0,
      speedRating: parseInt(speedRating) || 0,
      reviewerName: (reviewerName || '').substring(0, 100),
      reviewText: (reviewText || '').substring(0, 1000),
      recommendation: recommendation || '',
      userAgent: req.get('User-Agent') || '',
      ip: req.ip || req.connection.remoteAddress || ''
    };
    
    const reviewId = saveFeedbackToFile('review', reviewData);
    
    // Save to database if available
    if (db && dbType === 'supabase') {
      try {
        const { error } = await db.from('user_reviews').insert([{
          review_id: reviewId,
          overall_rating: reviewData.overallRating,
          usability_rating: reviewData.usabilityRating,
          speed_rating: reviewData.speedRating,
          reviewer_name: reviewData.reviewerName,
          review_text: reviewData.reviewText,
          recommendation: reviewData.recommendation,
          created_at: new Date().toISOString()
        }]);
        
        if (error) console.log('Review database save failed:', error);
      } catch (dbError) {
        console.log('Review database save error:', dbError);
      }
    }
    
    res.json({
      success: true,
      message: 'شكراً لك! تم إرسال تقييمك بنجاح.',
      reviewId: reviewId,
      averageRating: await calculateAverageRating()
    });
    
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في إرسال التقييم'
    });
  }
});

// Submit suggestion for improvement
app.post('/api/suggestion', async (req, res) => {
  try {
    const { category, title, description, benefit, priority, suggesterInfo } = req.body;
    
    if (!category || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'برجاء ملء الحقول المطلوبة'
      });
    }
    
    const suggestionData = {
      category: category.substring(0, 50),
      title: title.substring(0, 200),
      description: description.substring(0, 2000),
      benefit: (benefit || '').substring(0, 1000),
      priority: priority || 'medium',
      suggesterInfo: (suggesterInfo || '').substring(0, 200),
      userAgent: req.get('User-Agent') || '',
      ip: req.ip || req.connection.remoteAddress || ''
    };
    
    const suggestionId = saveFeedbackToFile('suggestion', suggestionData);
    
    // High priority suggestions get immediate notification
    if (priority === 'high' || priority === 'critical') {
      await sendWhatsAppNotification('suggestion', suggestionData);
    }
    
    // Save to database if available
    if (db && dbType === 'supabase') {
      try {
        const { error } = await db.from('user_suggestions').insert([{
          suggestion_id: suggestionId,
          category: suggestionData.category,
          title: suggestionData.title,
          description: suggestionData.description,
          benefit: suggestionData.benefit,
          priority: suggestionData.priority,
          suggester_info: suggestionData.suggesterInfo,
          status: 'new',
          created_at: new Date().toISOString()
        }]);
        
        if (error) console.log('Suggestion database save failed:', error);
      } catch (dbError) {
        console.log('Suggestion database save error:', dbError);
      }
    }
    
    res.json({
      success: true,
      message: 'تم إرسال اقتراحك بنجاح! سنقوم بدراسته وتطبيقه إن أمكن.',
      suggestionId: suggestionId,
      estimatedReview: priority === 'critical' ? 'خلال 24 ساعة' : priority === 'high' ? 'خلال 3 أيام' : 'خلال أسبوع'
    });
    
  } catch (error) {
    console.error('Suggestion submission error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في إرسال الاقتراح'
    });
  }
});

// Quick contact form
app.post('/api/quick-contact', async (req, res) => {
  try {
    const { name, contact, message } = req.body;
    
    if (!name || !contact || !message) {
      return res.status(400).json({
        success: false,
        message: 'برجاء ملء جميع الحقول'
      });
    }
    
    const contactData = {
      name: name.substring(0, 100),
      contact: contact.substring(0, 100),
      message: message.substring(0, 500),
      userAgent: req.get('User-Agent') || '',
      ip: req.ip || req.connection.remoteAddress || ''
    };
    
    const contactId = saveFeedbackToFile('contact', contactData);
    
    // Always send notification for contact requests
    await sendWhatsAppNotification('contact', contactData);
    
    res.json({
      success: true,
      message: 'تم إرسال رسالتك! سنتواصل معك خلال 24 ساعة.',
      contactId: contactId
    });
    
  } catch (error) {
    console.error('Quick contact error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في إرسال الرسالة'
    });
  }
});

// Get feedback statistics (for admin)
app.get('/api/feedback-stats', async (req, res) => {
  try {
    const stats = {
      totalFeedback: 0,
      totalReviews: 0,
      totalSuggestions: 0,
      averageRating: 0,
      recentCount: 0
    };
    
    // Count files in feedback directory
    if (fs.existsSync(feedbackDir)) {
      const files = fs.readdirSync(feedbackDir);
      
      stats.totalFeedback = files.filter(f => f.startsWith('feedback-')).length;
      stats.totalReviews = files.filter(f => f.startsWith('review-')).length;
      stats.totalSuggestions = files.filter(f => f.startsWith('suggestion-')).length;
      
      // Count recent (last 7 days)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      stats.recentCount = files.filter(file => {
        const filepath = path.join(feedbackDir, file);
        const stat = fs.statSync(filepath);
        return stat.mtime > weekAgo;
      }).length;
    }
    
    stats.averageRating = await calculateAverageRating();
    
    res.json({
      success: true,
      stats: stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Feedback stats error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في استرجاع الإحصائيات'
    });
  }
});

// Get recent feedback (for admin dashboard)
app.get('/api/recent-feedback', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const recentFeedback = [];
    
    if (fs.existsSync(feedbackDir)) {
      const files = fs.readdirSync(feedbackDir)
        .filter(file => file.endsWith('.json') && !file.includes('log'))
        .map(file => {
          const filepath = path.join(feedbackDir, file);
          const stat = fs.statSync(filepath);
          return {
            file: file,
            mtime: stat.mtime
          };
        })
        .sort((a, b) => b.mtime - a.mtime)
        .slice(0, limit);
      
      files.forEach(fileInfo => {
        try {
          const filepath = path.join(feedbackDir, fileInfo.file);
          const content = JSON.parse(fs.readFileSync(filepath, 'utf8'));
          recentFeedback.push(content);
        } catch (e) {
          console.error('Error reading feedback file:', e);
        }
      });
    }
    
    res.json({
      success: true,
      feedback: recentFeedback,
      count: recentFeedback.length
    });
    
  } catch (error) {
    console.error('Recent feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في استرجاع التعليقات'
    });
  }
});

// Calculate average rating from reviews
async function calculateAverageRating() {
  try {
    let totalRating = 0;
    let reviewCount = 0;
    
    if (fs.existsSync(feedbackDir)) {
      const reviewFiles = fs.readdirSync(feedbackDir)
        .filter(file => file.startsWith('review-') && file.endsWith('.json'));
      
      reviewFiles.forEach(file => {
        try {
          const filepath = path.join(feedbackDir, file);
          const content = JSON.parse(fs.readFileSync(filepath, 'utf8'));
          if (content.data && content.data.overallRating) {
            totalRating += content.data.overallRating;
            reviewCount++;
          }
        } catch (e) {
          console.error('Error reading review file:', e);
        }
      });
    }
    
    return reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : 0;
    
  } catch (error) {
    console.error('Average rating calculation error:', error);
    return 0;
  }
}

// Mark feedback as read/responded (for admin)
app.post('/api/feedback-respond/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;
    
    // Find the feedback file
    const files = fs.readdirSync(feedbackDir);
    const targetFile = files.find(file => file.includes(id));
    
    if (!targetFile) {
      return res.status(404).json({
        success: false,
        message: 'التعليق غير موجود'
      });
    }
    
    const filepath = path.join(feedbackDir, targetFile);
    const content = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    
    content.status = status || 'responded';
    content.response = response;
    content.respondedAt = new Date().toISOString();
    
    fs.writeFileSync(filepath, JSON.stringify(content, null, 2));
    
    res.json({
      success: true,
      message: 'تم تحديث حالة التعليق بنجاح'
    });
    
  } catch (error) {
    console.error('Feedback response error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في تحديث التعليق'
    });
  }
});

// Export functions for use in main server
module.exports = {
  saveFeedbackToFile,
  sendWhatsAppNotification,
  calculateAverageRating
};
