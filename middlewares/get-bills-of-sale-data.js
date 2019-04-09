const { getUser, getVehicleByVin, getDealer } = require('./services');
const { models: { Deal } } = require('./models');


module.exports = async (ctx, next) => {
  const { id } = ctx.request.params;
  const { jwt } = ctx.state;

  const deal = await Deal.findById(id);

  ctx.assert(deal, 404, 'Deal not found or missing data');

  const [buyer, seller, vehicle, dealer] = await Promise.all([
    getUser(ctx.apiServices, deal.get('purchase.userId'), jwt),
    getUser(ctx.apiServices, deal.get('sell.userId'), jwt),
    getVehicleByVin(ctx.apiServices, deal.get('source.data.vin'), deal.get('sell.orgId'), jwt),
    getDealer(ctx.DMXServices, deal.get('sell.orgId'), jwt),
  ]).catch(error => ctx.throwLog(`Error found when populating data for deal with id: ${deal.get('id')}`, error));

  const billOfSaleData = {
    deal,
    seller,
    buyer,
    vehicle,
    dealer,
  };

  ctx.state.billOfSaleData = billOfSaleData;

  await next();
};
