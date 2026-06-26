module.exports = grammar({
  name: 'cangjie',
  extras: $ => [$.comment, $.line_comment, /\s/],
  conflicts: ($) => [
    [$.block, $.object_literal],
    [$.null, $.null_type],
    [$.void_type, $.unary_expression],
    [$._expression, $._type],
    [$._expression, $.generic_type],
    [$.cast_expression, $.union_type, $.intersection_type],
    [$.array_type, $.union_type, $.intersection_type],
    [$.union_type, $.intersection_type],
    [$.member_expression, $.unary_expression],
    [$.unary_expression, $.binary_expression],
    [$.call_expression, $.unary_expression],
    [$.index_expression, $.unary_expression],
    [$.unary_expression, $.ternary_expression],
    [$.return_statement, $.jumpExpression],
    [$.void_type, $.prefixUnaryOperator],
    [$.atomicExpression, $.literalConstant],
    [$._type, $.atomicExpression, $.leftAuxExpression, $.numericTypeConvExpr],
    [$._type, $.atomicExpression, $.leftAuxExpression, $.postfixExpression],
    [$._type, $.atomicExpression, $.leftAuxExpression],
    [$.generic_type, $.leftAuxExpression, $.atomicExpression],
    [$._type, $.atomicExpression],
    [$._type, $.leftValueExpressionWithoutWildCard, $.leftAuxExpression, $.atomicExpression],
    [$.union_type, $.intersection_type, $.leftAuxExpression, $.postfixExpression],
    [$.union_type, $.intersection_type, $.leftAuxExpression],
    [$.leftAuxExpression, $._type],
    [$.array_type, $.union_type, $.intersection_type, $.leftAuxExpression],
    [$.assignmentExpression, $.leftValueExpression],
    [$.coalescingExpression],
    [$.logicDisjunctionExpression],
    [$.logicConjunctionExpression],
    [$.rangeExpression],
    [$.bitwiseDisjunctionExpression],
    [$.bitwiseXorExpression],
    [$.bitwiseConjunctionExpression],
    [$.equalityComparisonExpression],
    [$.comparisonOrTypeExpression],
    [$.shiftingExpression],
    [$.additiveExpression],
    [$.multiplicativeExpression],
    [$.exponentExpression],
    [$.postfixExpression],
    [$.incAndDecExpression, $.postfixExpression],
    [$.leftAuxExpression, $.atomicExpression],
    [$.jumpExpression],
    [$._expression, $.jumpExpression],
    [$.flowExpression],
    [$.tuple_type, $.tupleLiteral],
    [$._type, $.leftValueExpressionWithoutWildCard, $.atomicExpression],
    [$.function_type, $.union_type, $.intersection_type, $.tuple_type],
    [$._expression, $.tupleLiteral],
    [$.try_statement, $.tryExpression],
    [$.union_type],
    [$.intersection_type],
    [$.leftAuxExpression, $.assignableSuffix],
    [$._type, $.atomicExpression, $.numericTypeConvExpr],
    [$.postfixExpression, $.atomicExpression],
    [$.generic_type, $.atomicExpression],
    [$.union_type, $.intersection_type, $.postfixExpression],
    [$._type, $.leftValueExpressionWithoutWildCard, $.leftAuxExpression],
    [$._type, $.leftValueExpressionWithoutWildCard, $.leftAuxExpression, $.valueArgument, $.atomicExpression],
    [$.generic_type, $.typeArguments],
    [$.generic_type, $.union_type, $.intersection_type, $.typeArguments],
    [$.leftAuxExpression, $.fieldAccess],
    [$.rangeElement],
    [$.union_type, $.intersection_type, $.comparisonOrTypeExpression],
    [$.questSeperatedItem],
    [$.questSeperatedItems],
    [$._type, $.generic_type],
    [$.array_type, $.union_type, $.intersection_type, $.comparisonOrTypeExpression],
    [$.variable_declaration, $.union_type, $.intersection_type],
    [$.const_declaration, $.union_type, $.intersection_type],
    [$.type_definition, $.union_type, $.intersection_type],
    [$.function_type, $.union_type, $.intersection_type],
    [$.array_type, $.function_type, $.union_type, $.intersection_type],
    [$._type, $.leftValueExpressionWithoutWildCard],
    [$.parameter, $.union_type, $.intersection_type],
    [$.parenthesized_expression, $.if_statement],
    [$.parenthesized_expression, $.while_statement],
    [$._type, $.leftValueExpressionWithoutWildCard, $.leftAuxExpression, $.refTransferExpression, $.atomicExpression],
    [$.union_type, $.intersection_type, $.typeArguments],
    [$.fieldAccess],
    [$.itemAfterQuest],
    [$.generic_type, $.union_type, $.intersection_type],
    [$.tupleLiteral, $.lambdaExpression],
    [$.function_definition, $.union_type, $.intersection_type],
    [$.field_definition, $.union_type, $.intersection_type],
    [$.method_definition, $.union_type, $.intersection_type],
    [$.if_statement]
  ],
  precedences: ($) => [
    ["array_type", "postfixExpression", "leftAuxExpression"],
    ["left", "union_type"],
    ["left", "intersection_type"],
    ["left", "coalescingExpression"],
    ["left", "logicDisjunctionExpression"],
    ["left", "logicConjunctionExpression"],
    ["left", "rangeExpression"],
    ["expression", "type"]
  ],
  rules: {
    source_file: $ => seq(
      optional($.package_statement),
      repeat($.import_statement),
      repeat(choice($._statement, $._declaration))
    ),

    package_statement: $ => seq(
      'package',
      $.identifier,
      optional(seq('.', $.identifier)),
      ';'
    ),

    import_statement: $ => choice(
      seq(
        'import',
        $.identifier,
        optional(seq('.', $.identifier)),
        ';'
      ),

      seq(
        'import',
        '{',
        commaSep($.identifier),
        '}',
        'from',
        $.identifier,
        ';'
      )
    ),

    _statement: $ => choice(
      $.expression_statement,
      $.return_statement,
      $.if_statement,
      $.while_statement,
      $.for_statement,
      $.foreach_statement,
      $.try_statement,
      $.block,
      $.comment,
      $.line_comment
    ),

    _declaration: $ => choice(
      $.function_definition,
      $.class_definition,
      $.variable_declaration,
      $.const_declaration,
      $.enum_declaration,
      $.type_definition
    ),

    expression_statement: $ => seq($._expression, ';'),

    return_statement: $ => seq('return', optional($._expression), ';'),

    block: $ => seq('{', repeat($._statement), '}'),

    variable_declaration: $ => seq(
      'var',
      $.identifier,
      optional(seq(':', $._type)),
      optional(seq('=', $._expression)),
      ';'
    ),

    const_declaration: $ => seq(
      'const',
      $.identifier,
      optional(seq(':', $._type)),
      '=',
      $._expression,
      ';'
    ),

    // 类型定义
    type_definition: $ => seq(
      'type',
      $.identifier,
      '=',
      $._type,
      ';'
    ),

    // 枚举声明
    enum_declaration: $ => seq(
      'enum',
      $.identifier,
      '{',
      commaSep($.enum_member),
      '}',
      ';'
    ),

    enum_member: $ => seq(
      $.identifier,
      optional(seq('=', $._expression))
    ),

    // 函数定义
    function_definition: $ => seq(
      optional($.async_keyword),
      'function',
      $.identifier,
      '(',
      commaSep($.parameter),
      ')',
      optional(seq(':', $._type)),
      $.block
    ),

    async_keyword: $ => 'async',

    // 参数定义
    parameter: $ => seq(
      $.identifier,
      ':',
      $._type,
      optional(seq('=', $._expression))
    ),

    // 类定义
    class_definition: $ => seq(
      'class',
      $.identifier,
      optional(seq('extends', $.identifier)),
      optional(seq('implements', commaSep($.identifier))),
      '{',
      repeat(choice($.method_definition, $.constructor_definition, $.field_definition)),
      '}'
    ),

    // 方法定义
    method_definition: $ => seq(
      optional($.async_keyword),
      $.identifier,
      '(',
      commaSep($.parameter),
      ')',
      optional(seq(':', $._type)),
      $.block
    ),

    // 构造函数定义
    constructor_definition: $ => seq(
      'constructor',
      '(',
      commaSep($.parameter),
      ')',
      $.block
    ),

    // 字段定义
    field_definition: $ => seq(
      $.identifier,
      ':',
      $._type,
      optional(seq('=', $._expression)),
      ';'
    ),

    // 类型
    _type: $ => choice(
      $.identifier,
      $.array_type,
      $.function_type,
      $.generic_type,
      $.union_type,
      $.intersection_type,
      $.tuple_type,
      $.null_type,
      $.void_type
    ),

    array_type: $ => seq($._type, '[' , ']'),
    function_type: $ => seq('(', commaSep($._type), ')', '->', $._type),
    generic_type: $ => seq($.identifier, '<', commaSep($._type), '>'),
    union_type: $ => seq($._type, repeat(seq('|', $._type))),
    intersection_type: $ => seq($._type, repeat(seq('&', $._type))),
    tuple_type: $ => seq('(', commaSep($._type), ')'),
    null_type: $ => 'null',
    void_type: $ => 'void',

    // 表达式
    expression: $ => $.assignmentExpression,

    assignmentExpression: $ => choice(
      seq($.leftValueExpressionWithoutWildCard, optional($.NL), $.assignmentOperator, optional($.NL), $.flowExpression),
      seq($.leftValueExpression, optional($.NL), '=', optional($.NL), $.flowExpression),
      seq($.tupleLeftValueExpression, optional($.NL), '=', optional($.NL), $.flowExpression),
      $.flowExpression
    ),

    tupleLeftValueExpression: $ => seq(
      '(',
      optional($.NL),
      choice($.leftValueExpression, $.tupleLeftValueExpression),
      repeat(seq(optional($.NL), ',', optional($.NL), choice($.leftValueExpression, $.tupleLeftValueExpression))),
      optional(seq(optional($.NL), ',')),
      optional($.NL),
      ')'
    ),

    leftValueExpression: $ => choice(
      $.leftValueExpressionWithoutWildCard,
      '*'
    ),

    leftValueExpressionWithoutWildCard: $ => choice(
      $.identifier,
      seq($.leftAuxExpression, optional('?'), optional($.NL), $.assignableSuffix)
    ),

    leftAuxExpression: $ => choice(
      seq($.identifier, optional(seq(optional($.NL), $.typeArguments))),
      $._type,
      $.thisSuperExpression,
      seq($.leftAuxExpression, optional('?'), optional($.NL), '.', optional($.NL), $.identifier, optional(seq(optional($.NL), $.typeArguments))),
      seq($.leftAuxExpression, optional('?'), $.callSuffix),
      seq($.leftAuxExpression, optional('?'), $.indexAccess)
    ),

    assignableSuffix: $ => choice(
      $.fieldAccess,
      $.indexAccess
    ),

    fieldAccess: $ => seq(optional($.NL), '.', optional($.NL), $.identifier),

    flowExpression: $ => seq(
      $.coalescingExpression,
      repeat(seq(optional($.NL), $.flowOperator, optional($.NL), $.coalescingExpression))
    ),

    flowOperator: $ => choice('||', '&&'),

    coalescingExpression: $ => seq(
      $.logicDisjunctionExpression,
      repeat(seq(optional($.NL), '??', optional($.NL), $.logicDisjunctionExpression))
    ),

    logicDisjunctionExpression: $ => seq(
      $.logicConjunctionExpression,
      repeat(seq(optional($.NL), '||', optional($.NL), $.logicConjunctionExpression))
    ),

    logicConjunctionExpression: $ => seq(
      $.rangeExpression,
      repeat(seq(optional($.NL), '&&', optional($.NL), $.rangeExpression))
    ),

    rangeExpression: $ => choice(
      seq(
        $.bitwiseDisjunctionExpression,
        optional($.NL),
        choice('..', '...'),
        optional($.NL),
        $.bitwiseDisjunctionExpression,
        optional(seq(optional($.NL), ':', optional($.NL), $.bitwiseDisjunctionExpression))
      ),
      $.bitwiseDisjunctionExpression
    ),

    bitwiseDisjunctionExpression: $ => seq(
      $.bitwiseXorExpression,
      repeat(seq(optional($.NL), '|', optional($.NL), $.bitwiseXorExpression))
    ),

    bitwiseXorExpression: $ => seq(
      $.bitwiseConjunctionExpression,
      repeat(seq(optional($.NL), '^', optional($.NL), $.bitwiseConjunctionExpression))
    ),

    bitwiseConjunctionExpression: $ => seq(
      $.equalityComparisonExpression,
      repeat(seq(optional($.NL), '&', optional($.NL), $.equalityComparisonExpression))
    ),

    equalityComparisonExpression: $ => seq(
      $.comparisonOrTypeExpression,
      optional(seq(optional($.NL), $.equalityOperator, optional($.NL), $.comparisonOrTypeExpression))
    ),

    equalityOperator: $ => choice('==', '!=', '===', '!=='),

    comparisonOrTypeExpression: $ => choice(
      seq($.shiftingExpression, optional(seq(optional($.NL), $.comparisonOperator, optional($.NL), $.shiftingExpression))),
      seq($.shiftingExpression, optional(seq(optional($.NL), 'is', optional($.NL), $._type))),
      seq($.shiftingExpression, optional(seq(optional($.NL), 'as', optional($.NL), $._type)))
    ),

    comparisonOperator: $ => choice('<', '>', '<=', '>='),

    shiftingExpression: $ => seq(
      $.additiveExpression,
      repeat(seq(optional($.NL), $.shiftingOperator, optional($.NL), $.additiveExpression))
    ),

    shiftingOperator: $ => choice('<<', '>>', '>>>'),

    additiveExpression: $ => seq(
      $.multiplicativeExpression,
      repeat(seq(optional($.NL), $.additiveOperator, optional($.NL), $.multiplicativeExpression))
    ),

    additiveOperator: $ => choice('+', '-'),

    multiplicativeExpression: $ => seq(
      $.exponentExpression,
      repeat(seq(optional($.NL), $.multiplicativeOperator, optional($.NL), $.exponentExpression))
    ),

    multiplicativeOperator: $ => choice('*', '/', '%'),

    exponentExpression: $ => seq(
      $.prefixUnaryExpression,
      repeat(seq(optional($.NL), '**', optional($.NL), $.prefixUnaryExpression))
    ),

    prefixUnaryExpression: $ => seq(
      repeat($.prefixUnaryOperator),
      $.incAndDecExpression
    ),

    prefixUnaryOperator: $ => choice('-', '+', '!', '~', 'typeof', 'void', 'delete'),

    incAndDecExpression: $ => seq(
      $.postfixExpression,
      optional(choice('++', '--'))
    ),

    postfixExpression: $ => choice(
      $.atomicExpression,
      seq($._type, optional($.NL), '.', optional($.NL), $.identifier),
      seq($.postfixExpression, optional($.NL), '.', optional($.NL), $.identifier, optional(seq(optional($.NL), $.typeArguments))),
      seq($.postfixExpression, $.callSuffix),
      seq($.postfixExpression, $.indexAccess),
      seq($.postfixExpression, optional($.NL), '.', optional($.NL), $.identifier, optional($.callSuffix), $.trailingLambdaExpression),
      seq($.identifier, optional($.callSuffix), $.trailingLambdaExpression),
      seq($.postfixExpression, repeat(seq('?', $.questSeperatedItems)))
    ),

    questSeperatedItems: $ => repeat1($.questSeperatedItem),

    questSeperatedItem: $ => seq(
      $.itemAfterQuest,
      optional(choice($.callSuffix, seq(optional($.callSuffix), $.trailingLambdaExpression), $.indexAccess))
    ),

    itemAfterQuest: $ => choice(
      seq('.', $.identifier, optional(seq(optional($.NL), $.typeArguments))),
      $.callSuffix,
      $.indexAccess,
      $.trailingLambdaExpression
    ),

    callSuffix: $ => seq(
      '(',
      optional($.NL),
      optional(seq(
        $.valueArgument,
        repeat(seq(optional($.NL), ',', optional($.NL), $.valueArgument)),
        optional($.NL)
      )),
      ')'
    ),

    valueArgument: $ => choice(
      seq($.identifier, optional($.NL), ':', optional($.NL), $.expression),
      $.expression,
      $.refTransferExpression
    ),

    refTransferExpression: $ => seq(
      'inout',
      optional(seq($.expression, '.')),
      $.identifier
    ),

    indexAccess: $ => seq(
      '[',
      optional($.NL),
      choice($.expression, $.rangeElement),
      optional($.NL),
      ']'
    ),

    rangeElement: $ => choice(
      '...',
      seq(choice('..', '...'), optional($.NL), $.expression),
      seq($.expression, optional($.NL), '...')
    ),

    atomicExpression: $ => choice(
      $.literalConstant,
      $.collectionLiteral,
      $.tupleLiteral,
      seq($.identifier, optional(seq(optional($.NL), $.typeArguments))),
      $.unitLiteral,
      $.ifExpression,
      $.matchExpression,
      $.loopExpression,
      $.tryExpression,
      $.jumpExpression,
      $.numericTypeConvExpr,
      $.thisSuperExpression,
      $.spawnExpression,
      $.synchronizedExpression,
      $.parenthesized_expression,
      $.lambdaExpression,
      $.quoteExpression,
      $.macroExpression,
      $.unsafeExpression
    ),

    _expression: $ => $.expression,

    this_expression: $ => 'this',
    super_expression: $ => 'super',
    thisSuperExpression: $ => choice(
      $.this_expression,
      $.super_expression
    ),

    array_literal: $ => seq('[' , commaSep($._expression), ']'),

    object_literal: $ => seq(
      '{',
      commaSep($.property_assignment),
      '}'
    ),

    property_assignment: $ => seq(
      choice($.identifier, seq('"', /[^"\\]*(\\.[^"\\]*)*",/)),
      ':',
      $._expression
    ),

    function_expression: $ => seq(
      optional($.async_keyword),
      'function',
      optional($.identifier),
      '(',
      commaSep($.parameter),
      ')',
      optional(seq(':', $._type)),
      $.block
    ),

    arrow_function: $ => seq(
      optional($.async_keyword),
      '(',
      commaSep($.parameter),
      ')',
      '=>',
      choice($.block, $._expression)
    ),

    call_expression: $ => seq(
      $._expression,
      '(',
      commaSep($._expression),
      ')'
    ),

    member_expression: $ => seq(
      $._expression,
      '.',
      $.identifier
    ),

    index_expression: $ => seq(
      $._expression,
      '[',
      $._expression,
      ']'
    ),

    new_expression: $ => seq(
      'new',
      $.identifier,
      '(',
      commaSep($._expression),
      ')'
    ),

    await_expression: $ => seq('await', $._expression),

    unary_expression: $ => seq(
      choice(
        '-', '+', '!', '~', 'typeof', 'void', 'delete'
      ),
      $._expression
    ),

    binary_expression: $ => seq(
      field('left', $._expression),
      field('operator', choice(
        '=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '>>>=', '^=', '|=', '&=',
        '+', '-', '*', '/', '%', '<<', '>>', '>>>', '&', '|', '^',
        '==', '!=', '===', '!==', '<', '>', '<=', '>=',
        '&&', '||', '??',
        'instanceof', 'in'
      )),
      field('right', $._expression)
    ),

    ternary_expression: $ => seq(
      $._expression,
      '?',
      $._expression,
      ':',
      $._expression
    ),

    parenthesized_expression: $ => seq('(', $._expression, ')'),

    cast_expression: $ => seq('(', $._type, ')', $._expression),

    if_statement: $ => seq(
      'if',
      '(',
      $._expression,
      ')',
      $._statement,
      optional(seq('else', $._statement))
    ),

    while_statement: $ => seq(
      'while',
      '(',
      $._expression,
      ')',
      $._statement
    ),

    for_statement: $ => seq(
      'for',
      '(',
      optional($._statement),
      ';',
      optional($._expression),
      ';',
      optional($._expression),
      ')',
      $._statement
    ),

    foreach_statement: $ => seq(
      'foreach',
      '(',
      $.identifier,
      'in',
      $._expression,
      ')',
      $._statement
    ),

    try_statement: $ => seq(
      'try',
      $.block,
      repeat($.catch_clause),
      optional($.finally_clause)
    ),

    catch_clause: $ => seq(
      'catch',
      '(',
      optional(seq($.identifier, ':', $.identifier)),
      ')',
      $.block
    ),

    finally_clause: $ => seq('finally', $.block),

    NL: $ => /\n+/,
    typeArguments: $ => seq('<', commaSep($._type), '>'),
    assignmentOperator: $ => choice('=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '>>>=', '^=', '|=', '&='),
    literalConstant: $ => choice(
      $.IntegerLiteral,
      $.FloatLiteral,
      $.RuneLiteral,
      $.ByteLiteral,
      $.boolean,
      $.string,
      $.ByteStringArrayLiteral,
      $.unitLiteral
    ),
    collectionLiteral: $ => $.array_literal,
    tupleLiteral: $ => seq('(', commaSep($.expression), ')'),
    unitLiteral: $ => '()',
    ifExpression: $ => seq('if', $.expression, $.block, optional(seq('else', $.block))),
    matchExpression: $ => seq('match', $.expression, '{', repeat($.caseClause), optional($.defaultClause), '}'),
    caseClause: $ => seq('case', $.expression, '=>', $.block),
    defaultClause: $ => seq('default', '=>', $.block),
    loopExpression: $ => choice(
      seq('loop', $.block),
      seq('while', $.expression, $.block),
      seq('for', $.identifier, 'in', $.expression, $.block)
    ),
    tryExpression: $ => seq('try', $.block, repeat($.catch_clause), optional($.finally_clause)),
    jumpExpression: $ => choice(
      seq('break', optional($.identifier)),
      seq('continue', optional($.identifier)),
      seq('return', optional($.expression))
    ),
    numericTypeConvExpr: $ => seq($.identifier, '.', $.identifier, $.callSuffix),
    spawnExpression: $ => seq('spawn', $.expression),
    synchronizedExpression: $ => seq('synchronized', $.expression, $.block),
    lambdaExpression: $ => seq(
      '(', commaSep($.parameter), ')', '=>', choice($.block, $.expression)
    ),
    trailingLambdaExpression: $ => seq('=>', choice($.block, $.expression)),
    quoteExpression: $ => seq('quote', $.expression),
    macroExpression: $ => seq('macro', $.identifier, $.callSuffix),
    unsafeExpression: $ => seq('unsafe', $.block),
    ByteStringArrayLiteral: $ => token(seq('b"', /[^"\\]*(\\.[^"\\]*)*"/)),
    IntegerLiteral: $ => token(/\d+([eE][+-]?\d+)?/),
    FloatLiteral: $ => token(/\d+[.][0-9]+([eE][+-]?\d+)?/),
    RuneLiteral: $ => token(seq('\'', /[^'\\]*(\\.[^'\\]*)*'/)),
    ByteLiteral: $ => token(seq('0b', /[01]+/)),

    comment: $ => token(seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')),
    line_comment: $ => token(seq('//', /[^\r\n]*/)),
    string: $ => token(seq('"', /[^"\\]*(\\.[^"\\]*)*",?/)),
    number: $ => token(/\d+([.]\d+)?([eE][+-]?\d+)?/),
    boolean: $ => token(choice('true', 'false')),
    null: $ => token('null'),
    identifier: $ => token(/[a-zA-Z_][a-zA-Z0-9_]*/),
    keyword: $ => token(choice(
      'import', 'export', 'package', 'return', 'if', 'else', 'switch', 'case',
      'default', 'while', 'for', 'foreach', 'try', 'catch', 'finally', 'throw',
      'async', 'await', 'foreign', 'unsafe', 'function', 'class', 'var', 'const',
      'type', 'enum', 'extends', 'implements', 'constructor', 'this', 'super', 'new'
    ))
  }
});

function commaSep(rule) {
  return optional(seq(rule, repeat(seq(',', rule))));
}
