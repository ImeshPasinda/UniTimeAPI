const Notification = require('../models/Notification');
const User = require('../models/User');

// Controller function to post a notification for a specific user
const postNotificationForUser = async (req, res) => {
    try {
        const { user, title, text } = req.body;
        
        // Create the notification
        const notification = new Notification({
            user,
            title,
            text
        });

        // Save the notification to the database
        await notification.save();

        res.status(201).json({ message: 'Notification posted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller function to get notifications for a user
const getNotificationsByUser = async (req, res) => {
    try {
        const { user } = req.params;

        if (user === 'all') {
            // Find notifications for all users
            const notifications = await Notification.find({});

            res.status(200).json(notifications);
        } else if (user === 'public') {
            // Find notifications for public users
            const notifications = await Notification.find({ user: 'Public' });

            res.status(200).json(notifications);
        } else {
            // Find notifications for a specific user
            const memberExists = await User.exists({ memberId: user });

            if (!memberExists) {
                return res.status(404).json({ message: 'User not found' });
            }

            const notifications = await Notification.find({ user });
            const notificationspublic = await Notification.find({ user: 'Public' });

            const combinedNotifications = notifications.concat(notificationspublic);

            res.status(200).json(combinedNotifications);

        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    postNotificationForUser,
    getNotificationsByUser
};
