'use strict';

// Local hard limit: options must never disable stack-exhaustion protection.
const MAX_DEPTH = 128;
const assertDepth = depth => {
  if (depth > MAX_DEPTH) {
    throw new SyntaxError('Brace nesting exceeds maximum depth (' + MAX_DEPTH + ')');
  }
};

module.exports = { MAX_DEPTH, assertDepth };
