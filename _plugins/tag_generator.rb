module Jekyll
  class TagPage < Page
    def initialize(site, base, tag, places)
      @site  = site
      @base  = base
      @dir   = File.join('tags', tag)
      @name  = 'index.html'
      process(@name)
      self.data = {
        'layout'      => 'tag',
        'title'       => tag,
        'tag'         => tag,
        'tag_places'  => places
      }
    end
  end

  class TagGenerator < Generator
    safe true
    priority :low

    def generate(site)
      tags = Hash.new { |h, k| h[k] = [] }
      site.collections['places'].docs.each do |place|
        (place.data['tags'] || []).each do |tag|
          tags[tag.to_s] << place
        end
      end
      tags.each do |tag, places|
        site.pages << TagPage.new(site, site.source, tag, places)
      end
    end
  end
end
