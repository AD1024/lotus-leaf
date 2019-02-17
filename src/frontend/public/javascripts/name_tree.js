var Trie = {
    name_tree: {},
    expand_trie(name_arr) {
        // Trie.expand_trie('UW/Alder/Panel1/Topic_name'.split('/'))
        this.name_tree = this.__expand_trie(this.name_tree, name_arr)
        return this.name_tree
    },
    __expand_trie(dict, name_arr) {
        if (name_arr.length === 0) return dict
        else if (name_arr.length === 1) {
            if (!dict.hasOwnProperty('places')) dict['places'] = []
            dict.places.push(name_arr[0])
        } else {
            const hd = name_arr[0]
            if (!dict.hasOwnProperty(hd)) dict[hd] = {}
            this.__expand_trie(dict[hd], name_arr.slice(1))
            return dict
        }
    },
    construct_names(name_prefix) {
        let name_obj = this.__construct_name(this.name_tree[name_prefix], name_prefix)
        let result = []
        for (let i of Object.keys(name_obj)) {
            result = result.concat(result, name_obj[i].map(function (terminals) {
                return i + '/' + terminals
            }))
        }
        return result
    },
    construct_all() {
        let result = []
        for (let top_level_keys of Object.keys(this.name_tree)) {
            result = result.concat(result, this.construct_names(top_level_keys))
        }
        return result
    },
    __construct_name(dict, name_prefix) {
        if (typeof dict === 'undefined' || dict === {} || Object.keys(dict).length === 0) {
            return {}
        } else {
            const keys = Object.keys(dict)
            let name_obj = {}
            if (keys.length === 1 && keys[0] === 'places') {
                name_obj[name_prefix] = []
                for (let i = 0; i < dict[keys[0]].length; ++i) {
                    name_obj[name_prefix].push(dict[keys[0]][i])
                }
            } else {
                for (let i = 0; i < keys.length; ++i) {
                    const key = keys[i]
                    const next_level = this.__construct_name(dict[key], name_prefix + '/' + key)
                    Object.assign(name_obj, next_level)
                }
            }
            return name_obj
        }
    },
    contains_name(name_arr) {
        return this.__contains(this.name_tree, name_arr)
    },
    __contains(dict, name) {
        if (typeof dict === 'undefined')
            return false
        else {
            if (name.length === 1) {
                if (typeof name[0] !== 'undefined')
                    if (Object.keys(dict).length === 1 && Object.keys(dict)[0] === 'places')
                        // Terminals
                        return dict.places.indexOf(name[0]) !== -1
                    else
                        // Non-terminals
                        return name[0] in dict
            } else if (typeof name[0] !== 'undefined' && name[0] in dict) {
                return this.__contains(dict[name[0]], name.slice(1))
            } else return false
        }
    },
    contains_long(name) {
        let name_arr = this.construct_all().filter(function(comp) {
            return comp.length <= name.length && name.indexOf(comp) !== -1
        })
        return name_arr.length > 0
    },
    remove(name_arr) {
        if (this.contains_name(name_arr))
            this.__remove(this.name_tree, name_arr)
        return this.name_tree
    },
    __remove(dict, name_arr) {
        if (typeof dict === 'undefined' || dict === {} || Object.keys(dict).length === 0) return dict
        else {
            if (name_arr.length === 1) {
                console.log(dict)
                if (Object.keys(dict).length === 1 && Object.keys(dict)[0] === 'places') {
                    dict.places = dict.places.filter(function (terminals) {
                        return terminals !== name_arr[0]
                    })
                } else {
                    delete dict[name_arr[0]]
                }
                return dict
            } else {
                return this.__remove(dict[name_arr[0]], name_arr.slice(1))
            }
        }
    }
}