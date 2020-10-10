import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const MonthlyExpenses = new Mongo.Collection('monthlyexpenses');

if (Meteor.isServer) {
    Meteor.publish('monthlyexpenses', function monthlyexpensesPublication() {
        return MonthlyExpenses.find( { owner: this.userId });
    });
}

Meteor.methods({
    'monthlyexpenses.insert'(expense) {
        check(expense, Object);

        if (!this.userId) {
            throw new Meteor.Error('not authorized');
        }

        MonthlyExpenses.insert({
            title: expense.title,
            recurringdate: expense.recurringdate,
            amount: expense.amount,
            category: expense.category,
            originalAmount: expense.originalAmount,
            currency: expense.currency,
            originalCurrency: expense.originalCurrency,
            owner: Meteor.userId(),
        });
    },

    'monthlyexpenses.remove' (expenseId) {
        check(expenseId, String);

        MonthlyExpenses.remove(expenseId);
    },

    'monthlyexpenses.update' (expenseId, expense) {
        check(expenseId, String);
        check(expense, Object);

        if (!this.userId) {
            throw new Meteor.Error('not authorized');
        }

        MonthlyExpenses.update(expenseId, {
            title: expense.title,
            recurringdate: expense.recurringdate,
            amount: expense.amount,
            category: expense.category,
            originalAmount: expense.originalAmount,
            currency: expense.currency,
            originalCurrency: expense.originalCurrency,
            owner: Meteor.userId(),
        });
    }
});