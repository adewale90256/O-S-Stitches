import { getPortfolioItems } from "./portfolio";
import { getCatalogueItems } from "./catalogue";
import { getAgreements } from "./agreements";

let portfolioCache = null;
let catalogueCache = null;
let agreementsCache = null;

let portfolioRequest = null;
let catalogueRequest = null;
let agreementsRequest = null;

export const getCachedPortfolio = () => portfolioCache;
export const getCachedCatalogue = () => catalogueCache;
export const getCachedAgreements = () => agreementsCache;

export function loadCachedPortfolio() {
  if (portfolioCache !== null) {
    return Promise.resolve(portfolioCache);
  }

  return refreshCachedPortfolio();
}

export function loadCachedCatalogue() {
  if (catalogueCache !== null) {
    return Promise.resolve(catalogueCache);
  }

  return refreshCachedCatalogue();
}

export function loadCachedAgreements() {
  if (agreementsCache !== null) {
    return Promise.resolve(agreementsCache);
  }

  return refreshCachedAgreements();
}

export function refreshCachedPortfolio() {
  if (portfolioRequest) return portfolioRequest;

  portfolioRequest = getPortfolioItems()
    .then((items) => {
      portfolioCache = items;
      return items;
    })
    .finally(() => {
      portfolioRequest = null;
    });

  return portfolioRequest;
}

export function refreshCachedCatalogue() {
  if (catalogueRequest) return catalogueRequest;

  catalogueRequest = getCatalogueItems()
    .then((items) => {
      catalogueCache = items;
      return items;
    })
    .finally(() => {
      catalogueRequest = null;
    });

  return catalogueRequest;
}

export function refreshCachedAgreements() {
  if (agreementsRequest) return agreementsRequest;

  agreementsRequest = getAgreements()
    .then((items) => {
      agreementsCache = items;
      return items;
    })
    .finally(() => {
      agreementsRequest = null;
    });

  return agreementsRequest;
}

export function setCachedAgreements(items) {
  agreementsCache = items;
}
