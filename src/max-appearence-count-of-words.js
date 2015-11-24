import _ from 'lodash';
import {getTokenizer} from 'kuromojin';

const defaultOptions = {
  limit: 4
};

function filterToken(token) {
  return token.pos === '名詞'
    && token.pos_detail_1 !== '数'
    && token.pos_detail_1 !== '非自立'
    && token.surface_form.length > 1;
}

function formatReport(word, count, limit) {
  return `${word} appears over ${limit} count in Paragraph ${count}`
}

export default function (context, options = {}) {
    const {Syntax, report, getSource, RuleError} = context;

    options = _.assign({}, defaultOptions, options);

    let globalParagraphCount = 0;
    return {
        [Syntax.Paragraph](node){
          const paragraphCount = ++globalParagraphCount;
          const paragraph = getSource(node);

          // 非同期でkuromoji.jsの初期化&ロック&キャッシュ
          return getTokenizer().then(tokenizer => {
            const tokens = tokenizer.tokenizeForSentence(paragraph);

            _(tokens).chain()
              .uniq(token => token.surface_form)
              .filter(filterToken)
              .filter(token => (paragraph.split(token.surface_form).length - 1) > options.limit)
              .forEach(token => report(node, new RuleError(formatReport(token.surface_form, paragraphCount, options.limit))))
              .value();
          });
        }
    }
};
