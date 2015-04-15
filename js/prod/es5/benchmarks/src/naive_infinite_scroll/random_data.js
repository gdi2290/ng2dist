System.register(["angular2/src/facade/lang", "angular2/src/facade/collection", "./common"], function($__export) {
  "use strict";
  var int,
      StringWrapper,
      List,
      ListWrapper,
      CustomDate,
      Offering,
      Company,
      Opportunity,
      Account,
      STATUS_LIST,
      AAT_STATUS_LIST,
      names,
      offsets,
      stringLengths,
      charCodeOffsets;
  function generateOfferings(count) {
    var res = [];
    for (var i = 0; i < count; i++) {
      ListWrapper.push(res, generateOffering(i));
    }
    return res;
  }
  function generateOffering(seed) {
    var res = new Offering();
    res.name = generateName(seed++);
    res.company = generateCompany(seed++);
    res.opportunity = generateOpportunity(seed++);
    res.account = generateAccount(seed++);
    res.basePoints = seed % 10;
    res.kickerPoints = seed % 4;
    res.status = STATUS_LIST[seed % STATUS_LIST.length];
    res.bundles = randomString(seed++);
    res.dueDate = randomDate(seed++);
    res.endDate = randomDate(seed++, res.dueDate);
    res.aatStatus = AAT_STATUS_LIST[seed % AAT_STATUS_LIST.length];
    return res;
  }
  function generateCompany(seed) {
    var res = new Company();
    res.name = generateName(seed);
    return res;
  }
  function generateOpportunity(seed) {
    var res = new Opportunity();
    res.name = generateName(seed);
    return res;
  }
  function generateAccount(seed) {
    var res = new Account();
    res.accountId = seed;
    return res;
  }
  function generateName(seed) {
    return names[seed % names.length];
  }
  function randomDate(seed) {
    var minDate = arguments[1] !== (void 0) ? arguments[1] : null;
    if (minDate == null) {
      minDate = CustomDate.now();
    }
    return minDate.addDays(offsets[seed % offsets.length]);
  }
  function randomString(seed) {
    var len = stringLengths[seed % 5];
    var str = '';
    for (var i = 0; i < len; i++) {
      str += StringWrapper.fromCharCode(97 + charCodeOffsets[seed % 9] + i);
    }
    return str;
  }
  $__export("generateOfferings", generateOfferings);
  $__export("generateOffering", generateOffering);
  $__export("generateCompany", generateCompany);
  $__export("generateOpportunity", generateOpportunity);
  $__export("generateAccount", generateAccount);
  return {
    setters: [function($__m) {
      int = $__m.int;
      StringWrapper = $__m.StringWrapper;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      CustomDate = $__m.CustomDate;
      Offering = $__m.Offering;
      Company = $__m.Company;
      Opportunity = $__m.Opportunity;
      Account = $__m.Account;
      STATUS_LIST = $__m.STATUS_LIST;
      AAT_STATUS_LIST = $__m.AAT_STATUS_LIST;
    }],
    execute: function() {
      Object.defineProperty(generateOfferings, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(generateOffering, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(generateCompany, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(generateOpportunity, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(generateAccount, "parameters", {get: function() {
          return [[int]];
        }});
      names = ['Foo', 'Bar', 'Baz', 'Qux', 'Quux', 'Garply', 'Waldo', 'Fred', 'Plugh', 'Xyzzy', 'Thud', 'Cruft', 'Stuff'];
      Object.defineProperty(generateName, "parameters", {get: function() {
          return [[int]];
        }});
      offsets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      Object.defineProperty(randomDate, "parameters", {get: function() {
          return [[int], [CustomDate]];
        }});
      stringLengths = [5, 7, 9, 11, 13];
      charCodeOffsets = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      Object.defineProperty(randomString, "parameters", {get: function() {
          return [[int]];
        }});
    }
  };
});
//# sourceMappingURL=random_data.es6.map

//# sourceMappingURL=./random_data.js.map