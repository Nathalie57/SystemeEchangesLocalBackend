/* global Demand */
'use strict';

/**
 * Demand.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

// Strapi utilities.
const utils = require('strapi-hook-bookshelf/lib/utils/');
const { convertRestQueryParams, buildQuery } = require('strapi-utils');


module.exports = {

  /**
   * Promise to fetch all demands.
   *
   * @return {Promise}
   */

  fetchAll: (params, populate) => {
    // Select field to populate.
    const withRelated = populate || Demand.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    const filters = convertRestQueryParams(params);

    return Demand.query(buildQuery({ model: Demand, filters }))
      .fetchAll({ withRelated })
      .then(data => data.toJSON());
  },

  /**
   * Promise to fetch a/an demand.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Demand.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    return Demand.forge(_.pick(params, 'id')).fetch({
      withRelated: populate
    });
  },

  /**
   * Promise to count a/an demand.
   *
   * @return {Promise}
   */

  count: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = convertRestQueryParams(params);

    return Demand.query(buildQuery({ model: Demand, filters: _.pick(filters, 'where') })).count();
  },

  /**
   * Promise to add a/an demand.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Demand.associations.map(ast => ast.alias));
    const data = _.omit(values, Demand.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Demand.forge(data).save();

    // Create relational data and return the entry.
    return Demand.updateRelations({ id: entry.id , values: relations });
  },

  /**
   * Promise to edit a/an demand.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Demand.associations.map(ast => ast.alias));
    const data = _.omit(values, Demand.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Demand.forge(params).save(data);

    // Create relational data and return the entry.
    return Demand.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to remove a/an demand.
   *
   * @return {Promise}
   */

  remove: async (params) => {
    params.values = {};
    Demand.associations.map(association => {
      switch (association.nature) {
        case 'oneWay':
        case 'oneToOne':
        case 'manyToOne':
        case 'oneToManyMorph':
          params.values[association.alias] = null;
          break;
        case 'oneToMany':
        case 'manyToMany':
        case 'manyToManyMorph':
          params.values[association.alias] = [];
          break;
        default:
      }
    });

    await Demand.updateRelations(params);

    return Demand.forge(params).destroy();
  },

  /**
   * Promise to search a/an demand.
   *
   * @return {Promise}
   */

  search: async (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('demand', params);
    // Select field to populate.
    const populate = Demand.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    const associations = Demand.associations.map(x => x.alias);
    const searchText = Object.keys(Demand._attributes)
      .filter(attribute => attribute !== Demand.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['string', 'text'].includes(Demand._attributes[attribute].type));

    const searchInt = Object.keys(Demand._attributes)
      .filter(attribute => attribute !== Demand.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['integer', 'decimal', 'float'].includes(Demand._attributes[attribute].type));

    const searchBool = Object.keys(Demand._attributes)
      .filter(attribute => attribute !== Demand.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['boolean'].includes(Demand._attributes[attribute].type));

    const query = (params._q || '').replace(/[^a-zA-Z0-9.-\s]+/g, '');

    return Demand.query(qb => {
      if (!_.isNaN(_.toNumber(query))) {
        searchInt.forEach(attribute => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query)}`);
        });
      }

      if (query === 'true' || query === 'false') {
        searchBool.forEach(attribute => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query === 'true')}`);
        });
      }

      // Search in columns with text using index.
      switch (Demand.client) {
        case 'mysql':
          qb.orWhereRaw(`MATCH(${searchText.join(',')}) AGAINST(? IN BOOLEAN MODE)`, `*${query}*`);
          break;
        case 'pg': {
          const searchQuery = searchText.map(attribute =>
            _.toLower(attribute) === attribute
              ? `to_tsvector(${attribute})`
              : `to_tsvector('${attribute}')`
          );

          qb.orWhereRaw(`${searchQuery.join(' || ')} @@ to_tsquery(?)`, query);
          break;
        }
      }

      if (filters.sort) {
        qb.orderBy(filters.sort.key, filters.sort.order);
      }

      if (filters.skip) {
        qb.offset(_.toNumber(filters.skip));
      }

      if (filters.limit) {
        qb.limit(_.toNumber(filters.limit));
      }
    }).fetchAll({
      withRelated: populate
    });
  }
};
