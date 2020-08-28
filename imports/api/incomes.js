import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Incomes = new Mongo.Collection('incomes');

if (Meteor.isServer) {
    Meteor.publish('incomes', function incomesPublication() {
        return Incomes.find( { owner: this.userId });
    })
}

Meteor.methods({
    'incomes.insert'(income) {
        check(income, Object);

        if (!this.userId) {
            throw new Meteor.Error('not authorized');
        }

        Incomes.insert({
            title: income.title,
            date: income.date,
            amount: income.amount,
            originalAmount: income.originalAmount,
            currency: income.currency,
            originalCurrency: income.originalCurrency,
            owner: Meteor.userId(),
        });
    },

    'incomes.remove' (incomeId) {
        check(incomeId, String);

        Incomes.remove(incomeId);
    },
});