'use strict'

// 组件
Vue.component('app', {
    template: `<div class="container"><div class="topBar">这个地方在渲染后不会被占用</div><slot></slot></div>`
})
Vue.component('app-header', {
    template: `<div class="header" slot="header">this is header</div>`
})
Vue.component('app-content', {
    template: `<div class="content">this is content</div>`
})
Vue.component('app-footer', {
    template: `<div class="footer">this is footer</div>`
})

Vue.component('list-header', {
    props: ['title'],
    // template : `<div class="footer">this is footer</div>`
    template: `<div style="text-align: center; padding: 20px 0;">{{ title }}</div>`
})

Vue.component('list-footer', {
    props: ['title'],
    // template : `<div class="footer">this is footer</div>`
    template: `<div style="text-align: center; padding: 20px 0;">{{ title }}</div>`
})

// 菜单
Vue.component('menu-item', {
    props: ['icon', 'title', 'uri'],
    template: `<a :href="uri" class="material-icons mdc-toolbar__icon" :aria-label="title" :alt="title">{{ icon }}</a>`
})

// 基本模版
const icon = `<img v-if="icon" class="mdc-list-item__graphic" :src="icon">`

// style="color: #fce4ec; background-color: #ec407a; width: 40px; height: 40px; border-radius: 50%;" 
const icon1 = `<span v-if="icon" class="mdc-list-item__graphic" role="presentation">
  <i class="material-icons" aria-hidden="true">{{ icon }}</i>
</span>`

const accessory_link = `    <a v-if="accessory" href="#" class="material-icons mdc-list-item__meta"
        aria-label="Add to favorites" title="Add to favorites"
        onclick="event.preventDefault()">{{ accessory }}</a>`

const accessory = `<i v-if="accessory" class="material-icons mdc-list-item__meta">{{ accessory }}</i>`

const list_item_default = `
    ${icon1}
    {{ title }}
    ${accessory}`

const list_item_subtitle = `
    ${icon}
    <span class="mdc-list-item__text">
        {{ title }}
        <span class="mdc-list-item__secondary-text">{{ subtitle }}</span>
    </span>
    ${accessory}`

const list_item_value1 = `
    ${icon}
    {{ title }}
    <span style="margin-left: auto; margin-right: 8px; color: var(--mdc-theme-text-secondary-on-background,rgba(0,0,0,.54));">{{ subtitle }}</span>
    <i v-if="accessory" class="material-icons mdc-list-item__meta" style="margin-left: -8px">{{ accessory }}</i>`

// List Item
Vue.component('list-item-default', {
    props: ['icon', 'title', 'accessory', 'uri', 'datavalue'],
    template: `
        <a v-if="uri" :href="uri" class="mdc-list-item" data-mdc-auto-init="MDCRipple" :datavalue="datavalue">
            ${list_item_default}
        </a>
        <li v-else class="mdc-list-item" :datavalue="datavalue">
            ${list_item_default}
        </li>`
})

Vue.component('list-item-subtitle', {
    props: ['icon', 'title', 'subtitle', 'accessory', 'uri'],
    template: `
        <a v-if="uri" :href="uri" class="mdc-list-item" data-mdc-auto-init="MDCRipple">
            ${list_item_subtitle}
        </a>
        <li v-else class="mdc-list-item">
            ${list_item_subtitle}
        </li>`
})

Vue.component('list-item-value1', {
    props: ['icon', 'title', 'subtitle', 'accessory', 'uri', 'datavalue'],
    template: `
        <a v-if="uri" :href="uri" class="mdc-list-item" data-mdc-auto-init="MDCRipple" :datavalue="datavalue">
            ${list_item_value1}
        </a>
        <li v-else class="mdc-list-item">
            ${list_item_value1}
        </li>`
})

// 卡片
Vue.component('small-card', {
    props: ['title', 'action', 'uri'],
    template: `
        <div class="mdc-card">
            <section class="mdc-card__media">
                <h1 class="mdc-card__title mdc-card__title--large">{{ title }}</h1>
            </section>
            <section class="mdc-card__actions">
                <a :href="uri" class="mdc-button mdc-button--compact mdc-card__action">{{ action }}</a>
            </section>
        </div>`
})

// 表单
// required 待优化 required pattern=".{1,}"
Vue.component('text-field', {
    props: ['name', 'helper_text', 'value'],
    template: `
        <div>
            <div class="mdc-text-field mdc-text-field--fullwidth">
                <input type="text" class="mdc-text-field__input"
                    v-bind:value="value"
                    v-on:input="updateValue($event.target.value)">
                <span class="mdc-text-field__label">{{ name }}</span>
                <div class="mdc-text-field__bottom-line"></div>
            </div>
            <p v-if="helper_text" class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
                {{ helper_text }}
            </p>
        </div>`,
    methods: {
        updateValue: function(value) {
            this.$emit('input', value)
        }
    }
})
