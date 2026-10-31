**English** | [简体中文](README.md)

# Multiple-image upload

The `UploadImgs` component supports multiple-image upload, preview, sorting, and validation. [Demo](http://face.cms.7yue.pro/#/imgs-upload/stage1)

- Ready to use
- Supports fixed and variable image counts
- Supports previews
- Supports sorting
- Built-in image validation
- Built-in support for the Lin-CMS upload API

## Basic example

```vue
<upload-imgs ref="uploadEle" :value="initData" />

<script>
import UploadImgs from "@/component/base/upload-imgs";

export default {
  components: {
    UploadImgs
  },
  data() {
    return {
      rules: {
        minWidth: 100,
        minHeight: 100,
        maxSize: 5
      },
      initData: []
    };
  },
  methods: {
    getValue() {
      this.$refs.uploadEle.getValue();
    }
  }
};
</script>
```

### Initialization

Pass an array during initialization. Use an empty array `[]` when there are no initial images; existing items must have the following structure:

|  Property   |     Type      | Required |             Description              |
| :-----: | :-----------: | :------: | :---------------------------: |
|   id    | String/Number  |    No    | ID of the initial item; recommended |
|  imgId  | String/Number |    No    |          Image resource ID          |
|   src   |    String     |    No    |         Relative image URL          |
| display |    String     |    Yes    |    Full image URL used for display     |

Example:

```js
const initData = [{
  id: '12d3',
  display: 'http://img-home.7yue.pro/images/index/Lin_cms_%E5%B0%81%E9%9D%A2.png',
  src: '/images/index/Lin_cms_%E5%B0%81%E9%9D%A2.png',
  imgId: '238287',
}, {
  id: '17qr',
  display: 'http://img-home.7yue.pro/images/index/Lin_UI_%E5%B0%81%E9%9D%A2.png',
  src: '/images/index/Lin_UI_%E5%B0%81%E9%9D%A2.png',
  imgId: '1232323',
}];
```

### Return values

Newly uploaded images include the complete image information.

|    Property    |     Type      | Default |                         Description                          |
| :--------: | :-----------: | :--: | :---------------------------------------------------: |
|     id     | String/Number  | null |                    ID of the initial item                    |
|   imgId    | String/Number | null |                      Image resource ID                      |
|    src     |    String     | null |                     Relative image URL                      |
|  display   |    String     | null |                     Full image URL                      |
|   width    |    Number     | null |                       Image width                        |
|   height   |    Number     | null |                       Image height                        |
|  fileName  |    String     | null |                        Filename                         |
|  fileSize  |     Number     | null |                       File size                        |
|  fileType  |    String     | null |    File media type (MIME); some file types are checked    |
| isAnimated |    Boolean    | null | Whether the image is animated; valid only when animation detection is enabled, otherwise null |

**Note:** These fields apply to newly uploaded images. Missing fields in initial images remain empty.

## props

|      Parameter      |     Type      |  Default  |                                            Description                                            |
| :------------: | :-----------: | :------: | :----------------------------------------------------------------------------------------: |
|     value      |     Array     |    []    |                                         Initial data                                         |
|  auto-upload   |    Boolean    |   true   |                                   Whether newly added images upload automatically                                   |
|    disabled    |    Boolean    |  false   |                                          Whether the component is disabled                                          |
|    preview     |    Boolean    |   true   |                                         Whether previews are enabled                                         |
|    multiple    |    Boolean    |  false   |                                      Whether multiple images can be selected at once                                      |
|    min-num     |    Number     |    0     |                                        Minimum image count                                        |
|    max-num     |    Number     |    0     |                                 Maximum image count; 0 means unlimited                                 |
| before-upload  |   Function    |   null   | Custom pre-upload validator; return true to continue or a failing value to stop. May return a Promise. |
|   remote-fuc   |   Function    |   null   |                               Override the remote method; may return a Promise                               |
|    sortable    |    Boolean    |  false   |                                         Whether images can be sorted                                         |
|     accept     |    String     | image/\* |                        Allowed upload types, using the same format as the input accept attribute                         |
| animated-check |    Boolean    |  false   |             Whether to detect animation; when enabled, isAnimated in the result indicates an animated image             |
|     rules      |    Object     |    {}    |                                          Image rules                                          |
|      fit       |    String     | contain  |                                        Image fit mode                                        |
|     width      | Number/String |   200    |                                       Width of each item                                       |
|     height     | Number/String |   200    |                                       Height of each item                                       |

The image validation rule supports the following properties:

|     Property      |     Type     | Default |                                                 Description                                                  |
| :-----------: | :----------: | :--: | :---------------------------------------------------------------------------------------------------: |
|     ratio     | Array/Number | null |                                   Ratio as [width, height] or width divided by height                                    |
|     width     |    Number    | null |                                             Required width                                              |
|    height     |    Number    | null |                                             Required height                                              |
|   minWidth    |    Number    | null |                                                Minimum width                                                 |
|   minHeight   |    Number    | null |                                                Minimum height                                                 |
|    minSize    |    Number    | null |                                            Minimum size (MB)                                            |
|    maxSize    |    Number    | null |                                            Maximum size (MB)                                            |
| allowAnimated |    Number    | null | Animation policy: 0 skips detection, 1 disallows animated images, and 2 allows only animated images. Set animated-check to true to enforce it. |

The default is `{ maxSize: 2 }`, limiting files to 2 MB, consistent with the Lin-CMS server upload API default.

## methods

|  Method  | Parameter |                     Description                     |
| :------: | :--: | :------------------------------------------: |
| getValue |  None  | Get the current value; returns false if validation fails |
|  clear   |  None  |               Clear the selected images               |
|  reset   |  None  |     Reset images to the initial value      |
