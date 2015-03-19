/**
 * TeamController
 *
 * @description :: Server-side logic for managing teams. Useful for testing many-to-many associations.
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var transaction = require('sails-mysql-transactions').Transaction;

module.exports = {
  create: function (req, res) {
    transaction.start(function (err, trans) {
      if (err) {
        trans.rollback();
        return res.serverError(err);
      }

      Team.create(trans.act(req.params.all()), function (err, team) {
        if (err) {
          trans.rollback();
          return res.serverError(err);
        }

        trans.commit();
        return res.json(team);
      });
    });
  },

  create_direct: function (req, res) {
    Team.create(req.params.all(), function (err, team) {
      if (err) {
        return res.serverError(err);
      }

      return res.json(team);
    });
  },


  add_member: function (req, res) {
    transaction.start(function (err, trans) {
      if (err) {
        trans.rollback();
        return res.serverError(err);
      }

      Team.findOne(req.param('id'), undefined, trans.connection().transactionId)
        .populate('members')
        .exec(function (err, team) {
          if (err) {
            trans.rollback();
            return res.serverError(err);
          }

          team.members.add(req.param('member_id'));
          team.transactionId = trans.connection().transactionId;
          team.save(function (err, team) {
            if (err) {
              trans.rollback();
              return res.serverError(err);
            }

            trans.commit();
            return res.json(team);
          });
        });
    });
  },

  remove_member: function (req, res) {
    transaction.start(function (err, trans) {
      if (err) {
        trans.rollback();
        return res.serverError(err);
      }

      Team.findOne(req.param('id'), undefined, trans.connection().transactionId)
        .populate('members')
        .exec(function (err, team) {
          if (err) {
            trans.rollback();
            return res.serverError(err);
          }

          team.members.remove(req.param('member_id'));
          team.transactionId = trans.connection().transactionId;
          team.save(function (err, team) {
            if (err) {
              trans.rollback();
              return res.serverError(err);
            }

            trans.commit();
            return res.json(team);
          });
        });
    });
  },

  add_member_direct: function (req, res) {
    Team.findOne(req.param('id')).populate('members').exec(function (err, team) {
      if (err) {
        return res.serverError(err);
      }

      team.members.add(req.param('member_id'));
      team.save(function (err, team) {
        if (err) {
          return res.serverError(err);
        }

        return res.json(team);
      });
    });
  }
};
