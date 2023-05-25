<table frame="void">
    <tr>
      <td width="200px">
        <img src="https://raw.githubusercontent.com/Lachee/himark/master/resources/logo.gif" align="center" width="100%" />
      </td>
      <td>
        <h1>HiMark</h1>
        <p>
            <a href="https://github.com/Lachee/himark/actions/workflows/build.yml"><img src="https://github.com/Lachee/himark/actions/workflows/build.yml/badge.svg" /></a>
          <br>
          This package is a wrapper around CodeMirror to add functionality like Discord's or GitHub's comment editing box.
          <br>
          Focused around comments, this forgoes a lot of fancy preview functionality for actually useful things such as built in @mention support using Tribute.JS
        </p>
      </td>
    </tr>
</table>

# Usage

Usage is not yet documented, but here is a very basic browser usage to get you started:
This example users the `/search` endpoint which returns a SELECT2 response.
```js
<div id='md-editor'></div>
<script>
    const editor = new HiMark.Editor(document.getElementById('md-editor'),  {
        placeholder: 'Write comment...',
        plugins: [
            new HiMark.Plugins.CheckboxPlugin(),
            new HiMark.Plugins.MentionPlugin({
                collections: [
                    {
                        trigger: '@',
                        lookup: 'text',
                        fillAttr: 'text',
                        allowSpaces: true,
                        selectTemplate: ({ original }) => `[@\${original.text}](#/identity/\${original.id})`,
                        values: async (text, cb) => {
                            $.ajax({
                                url: '/search?q=' + encodeURIComponent(text),
                                success: (data, status, response) => cb(data.results),
                            })
                        }
                    }
                ]
            }),
        ]
    });
</script>
```
yes, it uses jquery... it's just an example and could easily be replaced with `fetch`.