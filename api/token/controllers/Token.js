'use strict';

/**
 * Token.js controller
 *
 * @description: A set of functions called "actions" for managing `Token`.
 */

module.exports = {

  /**
   * Retrieve token records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.token.search(ctx.query);
    } else {
      return strapi.services.token.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a token record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.token.fetch(ctx.params);
  },

  /**
   * Count token records.
   *
   * @return {Number}
   */

  count: async (ctx, next, { populate } = {}) => {
    return strapi.services.token.count(ctx.query, populate);
  },

  /**
   * Create a/an token record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.token.add(ctx.request.body);
  },

  /**
   * Update a/an token record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.token.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an token record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.token.remove(ctx.params);
  }
};
