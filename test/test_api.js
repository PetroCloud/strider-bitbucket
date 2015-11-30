
var expect = require('expect.js')
  , api = require('../lib/api.js')

describe('The Bitbucket API', function () {
  describe('.parseRepo(repo)', function () {
    var gitrepo = require('./example_repo')
    it('should parse an example git repo', function () {
      expect(api.parseRepo(gitrepo)).to.eql({
        id: '1team/justdirectteam',
        name: '1team/justdirectteam',
        display_name: '1team/justdirectteam',
        display_url: 'https://bitbucket.org/1team/justdirectteam',
        group: '1team',
        private: true,
        config: {
          auth: {type: 'ssh'},
          scm: 'git',
          url: 'ssh://git@bitbucket.org/1team/justdirectteam',
          owner: '1team',
          repo: 'justdirectteam',
          pull_requests: 'none',
          whitelist: []
        }
      })
    });
    var hgrepo = require('./example_hg_repo');
    it('should parse an example hg repo', function () {
      expect(api.parseRepo(hgrepo)).to.eql({
        id: '1team/justdirectteam',
        name: '1team/justdirectteam',
        display_name: '1team/justdirectteam',
        display_url: 'https://bitbucket.org/1team/justdirectteam',
        group: '1team',
        private: true,
        config: {
          auth: {type: 'ssh'},
          scm: 'hg',
          url: 'ssh://hg@bitbucket.org/1team/justdirectteam',
          owner: '1team',
          repo: 'justdirectteam',
          pull_requests: 'none',
          whitelist: []
        }
      });
    });
  });
  describe('.postPayload(payload)', function() {
    var postpayload = require('./example_post.json');
    var skippayload = require('./example_post_skip.json');
    it('should parse an example commit payload', function() {
      expect(api.postPayload(postpayload)).to.eql({
        trigger: {
          type: 'commit',
          author: {
            name: 'Jared Forsyth',
            email: 'jabapyth+bitbucket@gmail.com',
            image: 'https://s.gravatar.com/avatar/33e65cf5aff804dbc595c8e250e36c3f'
          },
          url: 'https://bitbucket.org/jaredly/tester/commits/0fa628b2b56c48f937e9c375f555a5870faaa8fe',
          message: 'package.json edited online with Bitbucket',
          timestamp: '2013-11-06 00:29:04',
          source: {
            type: 'plugin',
            plugin: 'bitbucket'
          }
        },
        deploy: true,
        branch: 'master',
        ref: {
          branch: 'master',
          id: '0fa628b2b56c48f937e9c375f555a5870faaa8fe'
        }
      });
    });
    it('should skip if the commit message includes "[skip ci]"', function() {
      expect(api.postPayload(skippayload)).to.eql({ skipCi: true });
    });
  });
  describe('.prPayload(payload)', function() {
    var prcreated = require('./example_create_pr.json');
    var prupdated = require('./example_update_pr.json');
    it('should parse an example pull request created payload', function () {
      expect(api.prPayload(prcreated.pullrequest_created)).to.eql({
        trigger: {
          type: 'pullrequest',
          author: {
            name: 'Erik van Zijst',
            email: undefined,
            image: 'https://bitbucket-staging-assetroot.s3.amazonaws.com/c/photos/2013/Oct/28/evzijst-avatar-3454044670-3_avatar.png'
          },
          url: 'https://bitbucket.org/evzijst/bitbucket2/pull-request/24',
          message: 'PR title - Added description',
          timestamp: '2013-11-04T23:41:48.941334+00:00',
          source: {
            type: 'plugin',
            plugin: 'bitbucket'
          }
        },
        deploy: false,
        branch: 'mfrauenholtz/inbox',
        ref: {
          branch: 'mfrauenholtz/inbox',
          id: '325625d47b0a',
          destination: {
            branch: 'staging',
            ref: {
              branch: 'staging',
              id: '82d48819e5f7'
            }
          }
        }
      });
    });
    it('should parse an example pull request updated payload', function () {
      expect(api.prPayload(prupdated.pullrequest_updated)).to.eql({
        trigger: {
          type: 'pullrequest',
          author: {
            name: 'Erik van Zijst',
            email: undefined,
            image: 'https://bitbucket-staging-assetroot.s3.amazonaws.com/c/photos/2013/Oct/28/evzijst-avatar-3454044670-3_avatar.png'
          },
          url: '',
          message: 'README.md made even better - README.md made even better',
          timestamp: '2013-07-19 21:04:15+00:00',
          source: {
            type: 'plugin',
            plugin: 'bitbucket'
          }
        },
        deploy: false,
        branch: 'detkin/readmemd-made-even-better',
        ref: {
          branch: 'detkin/readmemd-made-even-better',
          id: '6ddd631f33de',
          destination: {
            branch: 'default',
            ref: {
              branch: 'default',
              id: '927fd129ad69'
            }
          }
        }
      });
    });
  });
});
