
### CRUDRelApp

```js
    var app = React.createElement(CRUDRelApp, {
      "title": "App 附圖",
      "basepath": "/bs/app_banner",
      "crudId": "app_banner",

      "parentAction": {% if CRUD.Record.id %}"edit"{% else %}"create"{% endif %},

      /*
      layout description for the record item
      */
      "itemDesc": {
        "display": "float",
        "coverImage": {
          "field": ["thumb", "image"],
          "width": 200,
          "height": 100,
          "backgroundSize": "cover"
        }
      },

      "schema": {
        "primaryKey": "id"
      },

      /*
      the reference schema for building new items and loading existing items.
      */
      "references": {
      "app_id": {
          "record": {{CRUD.Record.toArray()|json_encode|raw}},
          "key": "id",
          "referedRelationship": "banners"
      }
      },
      "delete": {
      "action": "AppBundle::Action::DeleteAppBanner",
      "by": "id",
      "confirm": "確認刪除?"
      },
      "load": {
      "query": {
          {% if CRUD.Record.id %}
          "app_id": {{CRUD.Record.id}}
          {% endif %}
      }
      }
    });
    ReactDOM.render(app, document.getElementById('{{eid}}'));
```

