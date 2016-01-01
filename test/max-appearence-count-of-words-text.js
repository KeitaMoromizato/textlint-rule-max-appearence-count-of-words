"use strict";

import assert from 'power-assert';
import {TextLintCore} from 'textlint';
import rule from '../src/max-appearence-count-of-words.js';

describe('max-appearence-count-of-words', function() {

  context('when use sample text', () => {
    const textlint = new TextLintCore();0

    textlint.setupRules({
      'max-appearence-count-of-words': rule
    });

    it('should report error', done => {
      textlint.lintFile('./test/fixtures/sample.md').then(result => {

        assert(result.messages.length === 1);
        assert(result.messages[0].message === 'パラグラフ appears over 4 count in Paragraph 1');

      }).then(done, done);
    });

    it('should not report error', done => {

      textlint.lintText('この文字列には繰り返しはありません。').then(result => {

        assert(result.messages.length === 0);

      }).then(done, done);
    });
  });

  context('when use sample text(with options)', () => {
    const textlint = new TextLintCore();0

    textlint.setupRules({
      'max-appearence-count-of-words': rule
    },{
      'max-appearence-count-of-words': {
        limit: 5
      }
    });

    it('should report error', done => {
      textlint.lintFile('./test/fixtures/sample.md').then(result => {

        assert(result.messages.length === 0);

      }).then(done, done);
    });

    it('should report in Japanese', done => {
      textlint.setupRules({
        'max-appearence-count-of-words': rule
      },{
        'max-appearence-count-of-words': {
          limit: 4,
          lang: 'ja'
        }
      });

      textlint.lintFile('./test/fixtures/sample.md').then(result => {

        assert(result.messages.length === 1);
        assert(result.messages[0].message === '「パラグラフ」が1段落目で4回以上登場しています。');

      }).then(done, done);
    })
  });
});
