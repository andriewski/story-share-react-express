api.post('/sendmessage', async (req, res) => {
  const { userID, friendID, message } = req.body

  try {
    const chatExist = await User.find({
      _id: userID,
      "messages.receiver": {
        $exists: true,
        $eq: friendID
      }
    }).count() > 0

    if (chatExist) {
      await User.update(
        { _id: userID,
          "messages.receiver": friendID
        },
        { $push: {
          "messages.$.history": {
            user: userID,
            message: message
          }
        }
        }
      );

      await User.update(
        { _id: friendID,
          "messages.receiver": userID
        },
        { $push: {
          "messages.$.history": {
            user: userID,
            message: message
          }
        }
        }
      )


      /*************ADDING NEW MESSAGES NOTIFICATION**************************/
      const newExists = await User.find({
        _id: friendID,
        "newmessages.user": {
          $exists: true,
          $eq: userID
        }
      }).count() > 0

      if (newExists) {
        await User.update(
          { _id: friendID },
          { $pull: {
            'newmessages': { user: userID }
          }
          }
        )

        await User.update(
          { _id: friendID },
          { $push: {
            "newmessages": {
              user: userID,
              message: message
            }
          }
          }
        )
      }

      if (!newExists) {
        await User.update(
          { _id: friendID },
          { $push: {
            "newmessages": {
              user: userID,
              message: message
            }
          }
          }
        )
      }
      /*************ADDING NEW MESSAGES NOTIFICATION**************************/

    }
    if (!chatExist) {
      await User.update(
        { _id: userID },
        { $push: {
          "messages": {
            "$each": [{ receiver: friendID }]
          }
        }
        }
      )

      await User.update(
        { _id: friendID },
        { $push: {
          "messages": {
            "$each": [{ receiver: userID }]
          }
        }
        }
      )

      await User.update(
        { _id: userID,
          "messages.receiver": friendID
        },
        { $push: {
          "messages.$.history": {
            user: userID,
            message: message
          }
        }
        }
      )

      await User.update(
        { _id: friendID,
          "messages.receiver": userID
        },
        { $push: {
          "messages.$.history": {
            user: userID,
            message: message
          }
        }
        }
      )

      /*************ADDING NEW MESSAGES NOTIFICATION**************************/
      const newExists = await User.find({
        _id: friendID,
        "newmessages.user": {
          $exists: true,
          $eq: userID
        }
      }).count() > 0

      if (newExists) {
        await User.update(
          { _id: friendID },
          { $pull: {
            'newmessages': { user: userID }
          }
          }
        )

        await User.update(
          { _id: friendID },
          { $push: {
            "newmessages": {
              user: userID,
              message: message
            }
          }
          }
        )
      }

      if (!newExists) {
        await User.update(
          { _id: friendID },
          { $push: {
            "newmessages": {
              user: userID,
              message: message
            }
          }
          }
        )
      }
      /*************ADDING NEW MESSAGES NOTIFICATION**************************/

    }
    const user = await User.findById({ _id: userID })
      .populate('messages.history.user')
    res.json({
      user
    })
  } catch (error) {
    return res.status(500).send({ error })
  }
})