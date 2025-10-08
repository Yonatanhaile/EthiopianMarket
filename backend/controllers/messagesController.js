const Message = require('../models/Message');
const Listing = require('../models/Listing');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Send message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { listingId, receiverId, content } = req.body;

    if (!listingId || !receiverId || !content) {
      return next(new ErrorResponse('Please provide listing, receiver, and message content', 400));
    }

    // Verify listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(new ErrorResponse('Listing not found', 404));
    }

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return next(new ErrorResponse('Receiver not found', 404));
    }

    // Create message
    const message = await Message.create({
      listing: listingId,
      sender: req.user.id,
      receiver: receiverId,
      content
    });

    await message.populate('sender receiver listing');

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's conversations
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { receiver: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            listing: '$listing',
            otherUser: {
              $cond: [
                { $eq: ['$sender', req.user._id] },
                '$receiver',
                '$sender'
              ]
            }
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', req.user._id] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'listings',
          localField: '_id.listing',
          foreignField: '_id',
          as: 'listing'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id.otherUser',
          foreignField: '_id',
          as: 'otherUser'
        }
      },
      {
        $unwind: '$listing'
      },
      {
        $unwind: '$otherUser'
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/messages/:listingId/:userId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const { listingId, userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({
      listing: listingId,
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id }
      ]
    })
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('sender receiver', 'name avatar')
      .lean();

    const total = await Message.countDocuments({
      listing: listingId,
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id }
      ]
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      data: messages.reverse() // Show oldest first
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return next(new ErrorResponse('Message not found', 404));
    }

    if (message.receiver.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized', 403));
    }

    message.isRead = true;
    message.readAt = Date.now();
    await message.save();

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};






