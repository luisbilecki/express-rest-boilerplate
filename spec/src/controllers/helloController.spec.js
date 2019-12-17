const request = require('supertest');

const app = require('../../../src/index');

describe('Hello Controller', function() {
    describe('v1', function() {
        it('should return hello response', function(done) {
            request(app)
                .get('/api/v1/hello')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect('"Hello from v1"')
                .end((err) => {
                    if (err) {
                        return done(err);
                    }

                    done();
                });
        });
    });

    describe('v2', function() {
        it('should return hello response with valid name', function(done) {
            request(app)
                .get('/api/v2/hello?name=Luis')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect('"Hello Luis. V2 API is working!"')
                .end((err) => {
                    if (err) {
                        return done(err);
                    }

                    done();
                });
        });

        it('should return bad request without name', function(done) {
            request(app)
                .get('/api/v2/hello')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    expect(res.body).toBeDefined();
                    expect(res.body.status).toEqual(400);
                    expect(res.body.error).toEqual('Bad request');
                    expect(res.body.path).toEqual('/api/v2/hello');

                    done();
                });

        });
    });
});
