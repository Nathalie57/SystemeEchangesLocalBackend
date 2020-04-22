'use strict';

/**
 * Demand.js controller
 *
 * @description: A set of functions called "actions" for managing `Demand`.
 */

module.exports = {

  /**
   * Retrieve demand records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.demand.search(ctx.query);
    } else {
      return strapi.services.demand.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a demand record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.demand.fetch(ctx.params);
  },

  /**
   * Count demand records.
   *
   * @return {Number}
   */

  count: async (ctx, next, { populate } = {}) => {
    return strapi.services.demand.count(ctx.query, populate);
  },

  /**
   * Create a/an demand record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.demand.add(ctx.request.body);
  },

  /**
   * Update a/an demand record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.demand.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an demand record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.demand.remove(ctx.params);
  }
};
