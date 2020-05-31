export default class Offer {
  constructor(offer) {
    this.type = offer[`type`];
    this.options = offer[`offers`];
  }


  static parseOffer(offer) {
    return new Offer(offer);
  }

  static parseOffers(offer) {
    return offer.map(Offer.parseOffer);
  }
}
