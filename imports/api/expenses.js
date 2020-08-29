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

    // 'expenses.setChecked' (expenseId, setChecked) {
    //     check(expenseId, String);
    //     check(setChecked, Boolean);

    //     Expenses.update(expenseId, { $set: {checked: setChecked}});
    // },
});