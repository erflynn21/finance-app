import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Expenses = new Mongo.Collection('expenses');

if (Meteor.isServer) {
    Meteor.publish('expenses', function expensesPublication() {
        return Expenses.find( { owner: this.userId });
    });
}

Meteor.methods({
    'expenses.insert'(expense) {
        check(expense, Object);

        if (!this.userId) {
            throw new Meteor.Error('not authorized');
        }

        Expenses.insert({
            title: expense.title,
            date: expense.date,
            amount: expense.amount,
            category: expense.category,
            originalAmount: expense.originalAmount,
            currency: expense.currency,
            originalCurrency: expense.originalCurrency,
            owner: Meteor.userId(),
        });
    },

    'expenses.remove' (expenseId) {
        check(expenseId, String);

        Expenses.remove(expenseId);
    },

    'expenses.update' (expenseId, expense) {
        check(expenseId, String);
        check(expense, Object);

        if (!this.userId) {
            throw new Meteor.Error('not authorized');
        }

        Expenses.update(expenseId, {
            title: expense.title,
            date: expense.date,
            amount: expense.amount,
            category: expense.category,
            originalAmount: expense.originalAmount,
            currency: expense.currency,
            originalCurrency: expense.originalCurrency,
            owner: Meteor.userId(),
        });
    },

    'expenses.delete' (owner) {
        check(owner, String)
        if (!this.userId) {
            throw new Meteor.error('not authorized');
        }
        Expenses.remove({owner: owner});
    }
});