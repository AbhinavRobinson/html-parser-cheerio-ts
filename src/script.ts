import * as cheerio from 'cheerio'
import {v4} from "uuid";
import {Element} from "cheerio";

const $ = cheerio.load(document.getElementById('app')?.outerHTML);

function parseElement($element: cheerio.Element, jsonTree: Record<string, any>, $: cheerio.CheerioAPI){
    // Get the tag name
    const tagName = `${$element.tagName}-${$element.attribs['data-unique']}`;
    // const type = $element.type;

    // Initialize an object for this element
    jsonTree[tagName] = {};

    // Get the attributes of the element
    const attributes = $element.attribs;
    if (Object.keys(attributes).length > 0) {
        jsonTree[tagName].attributes = attributes;
    }

    // Get the text content of the element
    // if (type === 'text') {
    //     const text = $element.data;
    //     if (text) {
    //         jsonTree[tagName].text = text;
    //     }
    // }

    console.log(jsonTree)
    // Recursively process child elements
    if ($element.children.length > 0) {
        jsonTree[tagName].children = {};
        $element.children.forEach((childElement) => {
            parseElement($(childElement)[0] as Element, jsonTree[tagName].children, $);
        });
    }
}

/**
 * Flood uuids into the dom
 * */
$('body *').each((_, element) => {
    const $element = $(element);
    const uniqueAttribute = `${v4()}`;
    $element.attr('data-unique', uniqueAttribute);
});
(document.getElementById('app') as { outerHTML: string }).outerHTML = $.html();

/**
 * Create JSON Tree
 * */
const result = {}

parseElement($.root().find('body').children()[0], result, $);

console.log(result)