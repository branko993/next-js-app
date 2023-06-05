import * as yup from 'yup'

export const promptSchema = yup.object().shape({
  prompt: yup.string().required('Prompt is required'),
  tag: yup
    .string()
    .required('Tag is required')
    .test(
      'tag-format',
      'Tag value must contain hashtags separated by spaces and start with "#"',
      (value) => /^(#\w+\s)*#\w+$/.test(value)
    ),
})
