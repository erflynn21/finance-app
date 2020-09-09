import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const MonthlyBudgets = new Mongo.Collection('monthlybudgets');

if (Meteor.isServer) {
    Meteor.publish('monthlybudgets', function monthlybudgetsPublication() {
        return MonthlyBudgets.find( { owner: this.userId });
    })
}

Meteor.methods({
    'monthlybudgets.insert'(monthlybudget) {
        check(monthlybudget, Object);

        if (!this.userId) {
            throw new Meteor.Error('not authorized');
        }

        MonthlyBudgets.insert({
            month: monthlybudget.month,
            year: monthlybudget.year,
            category: monthlybudget.category,
            currency: monthlybudget.currency,
            amount: monthlybudget.amount,
            owner: Meteor.userId(),
        });
    },
    
    'monthlybudgets.update' (monthlybudgetId, monthlybudget) {
        check(monthlybudgetId, String);
        check(monthlybudget, Object);

        if (!this.userId) {
            throw new Meteor.Error('not authorized');
        }

        MonthlyBudgets.update(monthlybudgetId, {
            month: monthlybudget.month,
            year: monthlybudget.year,
            category: monthlybudget.category,
            currency: monthlybudget.currency,
            amount: monthlybudget.amount,
            owner: Meteor.userId(),
        });
    }
});