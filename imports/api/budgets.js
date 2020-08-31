import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Budgets = new Mongo.Collection('budgets');

if (Meteor.isServer) {
    Meteor.publish('budgets', function budgetsPublication() {
        return Budgets.find( { owner: this.userId });
    })
}

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
            owner: Meteor.userId(),
        });
    },

    'budgets.remove' (budgetId) {
        check(budgetId, String);

        Budgets.remove(budgetId);
    },

    'budgets.update' (budgetId, budget) {
        check(budgetId, String);
        check(budget, Object);

        if (!this.userId) {
            throw new Meteor.Error('not authorized');
        }

        Budgets.update(budgetId, {
            category: budget.category,
            currency: budget.currency,
            amount: budget.amount,
            owner: Meteor.userId(),
        });
    }
});