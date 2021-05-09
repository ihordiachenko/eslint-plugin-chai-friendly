/**
 * @fileoverview Flag expressions in statement position that do not side effect
 * @author Michael Ficarra
 * @author Ihor Diachenko
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * Returns `true`.
 * @returns {boolean} `true`.
 */
function alwaysTrue() {
    return true;
}

/**
 * Returns `false`.
 * @returns {boolean} `false`.
 */
function alwaysFalse() {
    return false;
}


module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow unused expressions",
            category: "Best Practices",
            recommended: false
        },

        schema: [
            {
                type: "object",
                properties: {
                    allowShortCircuit: {
                        type: "boolean"
                    },
                    allowTernary: {
                        type: "boolean"
                    },
                    allowTaggedTemplates: {
                        type: "boolean"
                    },
                    enforceForJSX: {
                        type: "boolean",
                        default: false
                    }
                },
                additionalProperties: false
            }
        ],

        messages: {
            unusedExpression: "Expected an assignment or function call and instead saw an expression."
        }
    },
    create: function (context) {
        var config = context.options[0] || {},
            allowShortCircuit = config.allowShortCircuit || false,
            allowTernary = config.allowTernary || false,
            allowTaggedTemplates = config.allowTaggedTemplates || false,
            enforceForJSX = config.enforceForJSX || false;

        /**
         * @param {ASTNode} node - any node
         * @returns {boolean} whether the given node structurally represents a directive
         */
        function looksLikeDirective(node) {
            return node.type === "ExpressionStatement" &&
                node.expression.type === "Literal" && typeof node.expression.value === "string";
        }

        /**
         * @param {Function} predicate - ([a] -> Boolean) the function used to make the determination
         * @param {a[]} list - the input list
         * @returns {a[]} the leading sequence of members in the given list that pass the given predicate
         */
        function takeWhile(predicate, list) {
            for (var i = 0; i < list.length; ++i) {
                if (!predicate(list[i])) {
                    return list.slice(0, i);
                }
            }
            return list.slice();
        }

        /**
         * @param {ASTNode} node - a Program or BlockStatement node
         * @returns {ASTNode[]} the leading sequence of directive nodes in the given node's body
         */
        function directives(node) {
            return takeWhile(looksLikeDirective, node.body);
        }

        /**
         * @param {ASTNode} node - any node
         * @param {ASTNode[]} ancestors - the given node's ancestors
         * @returns {boolean} whether the given node is considered a directive in its current position
         */
        function isDirective(node, ancestors) {
            var parent = ancestors[ancestors.length - 1],
                grandparent = ancestors[ancestors.length - 2];

            return (parent.type === "Program" || parent.type === "BlockStatement" &&
                    (/Function/.test(grandparent.type))) &&
                    directives(parent).indexOf(node) >= 0;
        }

        /**
         * The member functions return `true` if the type has no side-effects.
         * Unknown nodes are handled as `false`, then this rule ignores those.
         */
        const Checker = Object.assign(Object.create(null), {
            isDisallowed(node) {
                return (Checker[node.type] || alwaysFalse)(node);
            },

            ArrayExpression: alwaysTrue,
            ArrowFunctionExpression: alwaysTrue,
            BinaryExpression: alwaysTrue,
            ChainExpression(node) {
                return Checker.isDisallowed(node.expression);
            },
            ClassExpression: alwaysTrue,
            ConditionalExpression(node) {
                if (allowTernary) {
                    return Checker.isDisallowed(node.consequent) || Checker.isDisallowed(node.alternate);
                }
                return true;
            },
            FunctionExpression: alwaysTrue,
            Identifier: alwaysTrue,
            Literal: alwaysTrue,
            JSXElement() {
                return enforceForJSX;
            },
            JSXFragment() {
                return enforceForJSX;
            },
            LogicalExpression(node) {
                if (allowShortCircuit) {
                    return Checker.isDisallowed(node.right);
                }
                return true;
            },
            MemberExpression: alwaysTrue,
            MetaProperty: alwaysTrue,
            ObjectExpression: alwaysTrue,
            SequenceExpression: alwaysTrue,
            TaggedTemplateExpression() {
                return !allowTaggedTemplates;
            },
            TemplateLiteral: alwaysTrue,
            ThisExpression: alwaysTrue,
            UnaryExpression(node) {
                return node.operator !== "void" && node.operator !== "delete";
            }
        });

        /**
         * Determines whether or not a given node is a chai's expect statement.
         * e.g. expect(foo).to.eventually.be.true;
         * @param {ASTNode} node - any node
         * @returns {boolean} whether the given node is a chai expectation
         */
        function isChaiExpectCall(node) {
            let expression = node.expression;
            if (expression.type !== 'MemberExpression') {
                return false;
            }

            return Boolean(findExpectCall(expression.object));
        }

        /**
         * Searches for the chai expect(...) call down the AST.
         * @param {ASTNode} node - any node
         * @returns {ASTNode} expect(...) call expression or null
         */
        function findExpectCall(node) {
            // Found expect(...) call, return the node
            if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'expect') {
                return node;
            }

            // Continue search up the AST if it's a member call
            if (node.type === 'MemberExpression') {
                return findExpectCall(node.object);
            }
            if (node.type === 'CallExpression') {
                return findExpectCall(node.callee);
            }
            if (node.type === 'ChainExpression') {
                return findExpectCall(node.expression);
            }

            // Stop search, expect(...) not found
            return null;
        }

        /**
         * Determines whether or not a given node is a chai's should statement.
         * e.g. foo.should.eventually.be.true;
         * @param {ASTNode} node - any node
         * @returns {boolean} whether the given node is a chai should statement
         */
        function isChaiShouldCall(node) {
            let expression = node.expression;
            if (expression.type === 'ChainExpression') {
                expression = expression.expression
            }
            if (expression.type !== 'MemberExpression') {
                return false;
            }

            return Boolean(findShouldCall(expression.object));
        }

        /**
         * Searches for the chai obj.should call down the AST.
         * @param {ASTNode} node - any node
         * @returns {ASTNode} obj.should call expression or null
         */
        function findShouldCall(node) {
            // Found obj.should call, return the node
            if (node.type === 'MemberExpression' && node.property && node.property.name === 'should') {
                return node;
            }

            // Continue search up the AST if it's a member call
            if (node.type === 'MemberExpression') {
                return findShouldCall(node.object);
            }
            if (node.type === 'CallExpression') {
                return findShouldCall(node.callee);
            }
            if (node.type === 'ChainExpression') {
                return findShouldCall(node.expression);
            }

            // Stop search, obj.should not found
            return null;
        }


        return {
            ExpressionStatement: function(node) {
                var valid = !Checker.isDisallowed(node.expression)
                    || isDirective(node, context.getAncestors())
                    || isChaiExpectCall(node)
                    || isChaiShouldCall(node);
                if (!valid) {
                    context.report({node, messageId: "unusedExpression"});
                }
            }
        };
    }
};
