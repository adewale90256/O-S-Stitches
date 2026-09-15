import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'catalogue',
  title: 'Catalogue',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Agbada', value: 'Agbada'},
          {title: 'Traditional Wear', value: 'Traditional Wear'},
          {title: 'Ceremonial Wear', value: 'Ceremonial Wear'},
          {title: 'Native Wear', value: 'Native Wear'},
          {title: 'Custom Design', value: 'Custom Design'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
    }),

    defineField({
      name: 'priceType',
      title: 'Price Type',
      type: 'string',
      options: {
        list: [
          {title: 'Fixed Price', value: 'fixed'},
          {title: 'Starting From', value: 'starting'},
          {title: 'On Request', value: 'on-request'},
        ],
        layout: 'radio',
      },
      initialValue: 'on-request',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Enter the price in Nigerian Naira.',
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'available',
      title: 'Available',
      type: 'boolean',
      description: 'Turn this off if this design is currently unavailable.',
      initialValue: true,
    }),

    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'image',
      available: 'available',
    },

    prepare({title, category, media, available}) {
      return {
        title,
        subtitle: `${category || 'No category'} • ${available ? 'Available' : 'Unavailable'}`,
        media,
      }
    },
  },
})
