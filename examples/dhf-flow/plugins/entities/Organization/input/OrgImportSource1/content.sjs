'use strict'

/*
* Create Content Plugin
*
* @param id         - the identifier returned by the collector
* @param options    - an object containing options. Options are sent from Java
*
* @return - your content
*/
function createContent(id, rawContent, options) {
  

  let source;

  // for xml we need to use xpath
  if(rawContent && xdmp.nodeKind(rawContent) === 'element' && rawContent instanceof XMLDocument) {
    source = fn.head(rawContent.xpath('/*:envelope/*:instance/node()'));
  }
  // for json we need to return the instance
  else if(rawContent && rawContent instanceof Document) {
    source = fn.head(rawContent.root);
  }
  // for everything else
  else {
    source = rawContent;
  }

  return extractInstanceOrganization(source);
}
  
/**
* Creates an object instance from some source document.
* @param source  A document or node that contains
*   data for populating a Organization
* @return An object with extracted data and
*   metadata about the instance.
*/
function extractInstanceOrganization(source) {
  // the original source documents
  let attachments = source;
  // now check to see if we have XML or json, then just go to the instance
  if(source instanceof Element) {
    source = fn.head(source.xpath('/*:envelope/*:instance/*:root/node()'))
  } else if(source instanceof ObjectNode) {
    source = source.envelope.instance;
  }
  let orgName = !fn.empty(source.organization.orgName) ? xs.string(fn.head(source.organization.orgName)) : null;
  let structure = !fn.empty(source.organization.form) ? xs.string(fn.head(source.organization.form)) : null;
  let purpose = !fn.empty(source.organization.type) ? xs.string(fn.head(source.organization.type)) : null;

  // return the instance object
  return {
    '$attachments': attachments,
    '$type': 'Organization',
    '$version': '0.0.1',
    'orgName': orgName,
    'structure': structure,
    'purpose': purpose
  }
};


function makeReferenceObject(type, ref) {
  return {
    '$type': type,
    '$ref': ref
  };
}

module.exports = {
  createContent: createContent
};

