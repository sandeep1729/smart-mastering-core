xquery version "1.0-ml";

module namespace resource = "http://marklogic.com/rest-api/resource/sm-match-options";

import module namespace matcher = "http://marklogic.com/smart-mastering/matcher"
  at "/com.marklogic.smart-mastering/matcher.xqy";

declare namespace rapi = "http://marklogic.com/rest-api";

declare function get(
  $context as map:map,
  $params  as map:map
  ) as document-node()*
{
  if (map:contains($params, "name")) then
    document {
      matcher:get-options-as-json(map:get($params, "name"))
    }
  else
    fn:error((),"RESTAPI-SRVEXERR",
        (400, "Bad Request",
        "name parameter is required"))
};

declare function put(
  $context as map:map,
  $params  as map:map,
  $input   as document-node()*
  ) as document-node()?
{
  post($context, $params, $input)
};

declare
%rapi:transaction-mode("update")
function post(
  $context as map:map,
  $params  as map:map,
  $input   as document-node()*
  ) as document-node()*
{
  if (map:contains($params, "name")) then
    matcher:save-options(map:get($params, "name"), $input/(matcher:options|object-node()))
  else
    fn:error((),"RESTAPI-SRVEXERR",
        (400, "Bad Request",
        "name parameter is required"))
};

declare function delete(
  $context as map:map,
  $params  as map:map
  ) as document-node()?
{
  fn:error((), "RESTAPI-SRVEXERR", (405, "Method Not Allowed", "DELETE is not implemented"))
};
