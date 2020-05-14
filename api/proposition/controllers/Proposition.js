'use strict';

/**
 * Proposition.js controller
 *
 * @description: A set of functions called "actions" for managing `Proposition`.
 */

module.exports = {

  /**
   * Retrieve proposition records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.proposition.search(ctx.query);
    } else {
      return strapi.services.proposition.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a proposition record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.proposition.fetch(ctx.params);
  },

  /**
   * Count proposition records.
   *
   * @return {Number}
   */

  count: async (ctx, next, { populate } = {}) => {
    return strapi.services.proposition.count(ctx.query, populate);
  },

  /**
   * Create a/an proposition record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.proposition.add(ctx.request.body);
  },

  /**
   * Update a/an proposition record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.proposition.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an proposition record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.proposition.remove(ctx.params);
  }
};
