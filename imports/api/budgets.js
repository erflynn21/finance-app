import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Budgets = new Mongo.Collection('budgets');

Meteor.methods({
    'budgets.insert'(budget) {
        check(budget, Object);

        if (!this.userId) {
            throw new Meteor.Error('not authorized');
        }

        Budgets.insert({
            category: budget.category,
            amount: budget.amount,
            currency: budget.currency,
        });
    },

    'budgets.remove' (budgetId) {
        check(budgetId, String);

        Budgets.remove(budgetId);
    },
});