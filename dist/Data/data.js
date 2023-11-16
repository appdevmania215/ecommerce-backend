"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storePlan = exports.priceToPlan = void 0;
exports.priceToPlan = [
    {
        name: 'BasicMonthly',
        key: process.env.BASICMONTHLY
    },
    {
        name: 'BasicYearly',
        key: process.env.BASICYEARLY
    },
    {
        name: 'EssentialYearly',
        key: process.env.ESSENTIALYEARLY
    },
    {
        name: 'EssentialMonthly',
        key: process.env.ESSENTIALMONTHLY
    },
    {
        name: 'PremiumMonthly',
        key: process.env.PREMIUMMONTHLY
    },
    {
        name: 'PremiumYearly',
        key: process.env.PREMIUMYEARLY
    }
];
exports.storePlan = [
    {
        plan: 'basic',
        limit: 5,
        restriction: ['tools']
    },
    {
        plan: 'essential',
        limit: 10,
        restriction: []
    }, {
        plan: 'premium',
        limit: 50,
        restriction: []
    }
];
