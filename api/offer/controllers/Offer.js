'use strict';

/**
 * Offer.js controller
 *
 * @description: A set of functions called "actions" for managing `Offer`.
 */

module.exports = {

  /**
   * Retrieve offer records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.offer.search(ctx.query);
    } else {
      return strapi.services.offer.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a offer record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.offer.fetch(ctx.params);
  },

  /**
   * Count offer records.
   *
   * @return {Number}
   */

  count: async (ctx, next, { populate } = {}) => {
    return strapi.services.offer.count(ctx.query, populate);
  },

  /**
   * Create a/an offer record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.offer.add(ctx.request.body);
  },

  /**
   * Update a/an offer record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.offer.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Update a/an transaction.
   *
   * @return {Object}
   */
  updateTransaction: async (ctx, next) => {
    const member = await strapi.services.offer.member.find({id});
    const newAmount = member.walletAmount + ctx.request.body.offer.amount;
    let entity = await strapi.service.member.update({id}, {newAmount});

    const memberExchange = await strapi.services.offer.memberExchange.find({id});
    const newAmountMemberExchange = memberExchange.walletAmount + ctx.request.body.offer.amount;
    let entityMemberExchange = await strapi.service.memberExchange.update({id}, {newAmountMemberExchange});

    ctx.send("{succeed:true}")
  },

  /**
   * Destroy a/an offer record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.offer.remove(ctx.params);
  }
};
