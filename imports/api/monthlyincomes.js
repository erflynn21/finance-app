import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const MonthlyIncomes = new Mongo.Collection('monthlyincomes');

if (Meteor.isServer) {
    Meteor.publish('monthlyincomes', function monthlyincomesPublication() {
        return MonthlyIncomes.find( { owner: this.userId });
    });
}

Meteor.methods({
    'monthlyincomes.insert'(income) {
        check(income, Object);

        if (!this.userId) {
            throw new Meteor.Error('not authorized');
        }

        MonthlyIncomes.insert({
            title: income.title,
            recurringdate: income.recurringdate,
            amount: income.amount,
            category: income.category,
            originalAmount: income.originalAmount,
            currency: income.currency,
            originalCurrency: income.originalCurrency,
            owner: Meteor.userId(),
        });
    },

    'monthlyincomes.remove' (incomeId) {
        check(incomeId, String);

        MonthlyIncomes.remove(incomeId);
    },

    'monthlyincomes.update' (incomeId, income) {
        check(incomeId, String);
        check(income, Object);

        if (!this.userId) {
            throw new Meteor.Error('not authorized');
        }

        MonthlyIncomes.update(incomeId, {
            title: income.title,
            recurringdate: income.recurringdate,
            amount: income.amount,
            category: income.category,
            originalAmount: income.originalAmount,
            currency: income.currency,
            originalCurrency: income.originalCurrency,
            owner: Meteor.userId(),
        });
    }
});