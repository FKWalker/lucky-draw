import {
  argsOrArgArray,
  filter,
  not,
  raceWith
} from "./chunk-ANSFKXDE.js";
import {
  __read,
  __spreadArray
} from "./chunk-DTIHH3SQ.js";
import {
  __name
} from "./chunk-Y7LMDMBK.js";

// node_modules/rxjs/dist/esm5/internal/operators/partition.js
function partition(predicate, thisArg) {
  return function(source) {
    return [filter(predicate, thisArg)(source), filter(not(predicate, thisArg))(source)];
  };
}
__name(partition, "partition");

// node_modules/rxjs/dist/esm5/internal/operators/race.js
function race() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return raceWith.apply(void 0, __spreadArray([], __read(argsOrArgArray(args))));
}
__name(race, "race");

export {
  partition,
  race
};
//# sourceMappingURL=chunk-5J6MTK63.js.map
