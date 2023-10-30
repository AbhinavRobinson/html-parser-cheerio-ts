import * as cheerio from 'cheerio'
import * as uuid from "uuid";

const $ = cheerio.load(document.getElementById('app')?.outerHTML);

function parseElement($element: cheerio.Element, jsonTree: Record<string, any>, $: cheerio.CheerioAPI){
    // Get the tag name
    const tagName = `${$element.tagName}-${$element.attribs['data-unique']}`;

    // Initialize an object for this element
    jsonTree[tagName] = {};

    // Get the attributes of the element
    const attributes = $element.attribs;
    if (Object.keys(attributes).length > 0) {
        jsonTree[tagName].attributes = attributes;
    }

    // Recursively process child elements
    if ($element.children.length > 0) {
        jsonTree[tagName].children = {};
        $element.children.forEach((childElement) => {
            if(childElement.type === 'text'){
                jsonTree[tagName].text = childElement.data;
                return;
            }
            parseElement($(childElement)[0] as cheerio.Element, jsonTree[tagName].children, $);
        });
    }
}

/**
 * Flood uuids into the dom
 * */
$('body *').each((_, element) => {
    const $element = $(element);
    const uniqueAttribute = `${uuid.v4()}`;
    $element.attr('data-unique', uniqueAttribute);
});
(document.getElementById('app') as { outerHTML: string }).outerHTML = $.html();

/**
 * Create JSON Tree
 * */
const result = {}

parseElement($.root().find('body').children()[0], result, $);

console.log(result)