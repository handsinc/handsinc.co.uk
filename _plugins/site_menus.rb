# encoding: utf-8
#
# Jekyll site menus.
# https://github.com/MrWerewolf/jekyll-site-menus
#
# Copyright (c) 2012 Ryan Seto <mr.werewolf@gmail.com>
# Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
#
# Place this script into the _plugins directory of your Jekyll site.
#
require 'uri'

module Jekyll
  class SiteMenus < Liquid::Tag
    def initialize(tag_name, menu_name, tokens)
      super
      @menu_name = menu_name.strip!
    end

    def render(context)
      site = context.registers[:site]
      menu = site.config['menus'][@menu_name]
      level = 1

      renderMenu(context, menu, level)
    end

    def li(indent, context, value)
      "#{indent}<li class=\"#{activeItem(context, value) ? 'active' : ''}\">\n"
    end

    def page_url(context)
      context.environments.first["page"]["url"]
    end

    def renderMenu(context, menu, level)
      indent = "  " * (level - 1)
      output = "#{indent}"
      isFirstLvl = level == 1

      # Give this menu an id attribute if we're on the first level.
      if (isFirstLvl)
        output += "<ul id=\"#{@menu_name}-menu\" class=\"menu level-#{level}\">\n"
      else
        output += "<div class=\"sub-menu level-#{level}\"><ul class=\"sub-menu level-#{level}\">\n"
      end

      indent = "  " * (level)
      menu.each do | item |
        item.each do | name, value |
          if (value.kind_of? String)
            # Render the menu item
            output += li(indent, context, value)
            output += renderMenuItem(context, name, value, level)
            output += "#{indent}</li>\n"
          elsif (value.kind_of? Array and value.size > 0)
            if (value[0].kind_of? String)
              output += li(indent, context, value[0])
              output += renderMenuItem(context, name, value[0], level)
              submenu = value [1..value.size]
            else
              fail 'unexpected'
              output += "#{indent}<li>\n"
              submenu = value
            end
            # Render the sub-menu
            # if activeItem(context, value[0])
            if page_url(context).start_with?(value[0])
              output += renderMenu(context, submenu, level + 1)
            end
            output += "#{indent}</li>\n"
          end
        end
      end

      indent = "  " * (level - 1)

      if (isFirstLvl)
        output += "#{indent}</ul>\n"
      else
        output += "#{indent}</ul></div>\n"
      end
    end

    def activeItem(context, value)
      active = value == context.environments.first["page"]["url"]
    end

    def renderMenuItem(context, name, value, level)
      page_url = context.environments.first["page"]["url"]
      uri = URI(value)

      # Figure out if our menu item is currently selected.
      selected = false
      unless (uri.absolute?)
        base_path= uri.path[-1, 1] == '/' ? uri.path : File.dirname(uri.path)
        path_parts = base_path.split('/')
        # p [base_path, page_url, value] if page_url.start_with?('/aboutus/')
        # if base_path == page_url
        #   selected = true
        # elsif (path_parts.size > 0)
        #   selected = (/^#{base_path}/ =~ page_url) != nil
        # elsif (value == '/' and page_url == '/index.html')
        #   selected = true
        # else
          selected = value == page_url
        # end
      end
      indent = "  " * level
      active =
      output = "#{indent}<a href=\"#{value}\""
      if (selected)
        output += " class=\"active\""
      end
      output += ">"
      output += "<img src=\"/images/stories/handbullet.png\" align=\"left\" alt=\"#{name}\" />" if level == 1
      output += "<span>#{name}</span>"
      output += "</a>\n"
    end
  end

  Liquid::Template.register_tag('menu', Jekyll::SiteMenus)
end
