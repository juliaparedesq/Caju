import Vue from 'vue';

/**
 * This service implements an store service similar to vuex and redux using only the
 * vue standard object 'observable'. An observable object behaves the same as a data
 * object in a component, i.e. when one of their fields is mutated it notifies the
 * change to the dependants. In order to listen reactively to a value of the store in
 * a component the recommended way is to add a computed value using getStore method.
 * Note: you need to define in advance the keys of the store within this file
 */
let store = Vue.observable({
  user: null
  // Add other shared values here
});

export function getStore(key) {
  return () => store[key];
}

export function setStore(key, value) {
  // console.log(key, value);
  store[key] = value;
}
