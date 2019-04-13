describe ('LearnJS', function(){
    it('can show a problem view', function(){
        learnjs.showView('#problem-1');
        expect($('.view-container .problem-view').length).toEqual(1);
    }
    );

    it('shows the landing page view when there is no hash', function(){
        learnjs.showView('');
        expect($('.view-container .landing-view').length).toEqual(1);
    }
    );

    it('passes the hash view parameter to the view function', function() {
        spyOn(learnjs, 'problemView');
        learnjs.showView('#problem-42');
        expect(learnjs.problemView).toHaveBeenCalledWith('42');
    }
    );

    it('invokes the router when loaded', function() {
        spyOn(learnjs, 'showView');
        learnjs.appOnReady();
        expect(learnjs.showView).toHaveBeenCalledWith(window.location.hash);
    }
    );

    it('subscribes to the hash change event', function() {
        learnjs.appOnReady();
        spyOn(learnjs, 'showView');
        $(window).trigger('hashchange');
        expect(learnjs.showView).toHaveBeenCalledWith(window.location.hash);
    }
    );

    describe('problem view', function() {
        it('has a title that includes the problem number 1', function() {
            var view = learnjs.problemView('1');
            expect(view.find('.title').text()).toEqual('Problem #1');
        }
        );

        it('shows the description 1', function() {
            var view = learnjs.problemView('1');
            expect(view.find('[data-name="description"]').text()).toEqual('What is truth?');
        }
        );

             it('shows the code 1', function() {
            var view = learnjs.problemView('1');
            expect(view.find('[data-name="code"]').text()).toEqual('function problem() {return __; }');
        }
        );

        it('has a title that includes the problem number 2', function() {
            var view = learnjs.problemView('2');
            expect(view.find('.title').text()).toEqual('Problem #2');
        }
        );

        it('shows the description 2', function() {
            var view = learnjs.problemView('2');
            expect(view.find('[data-name="description"]').text()).toEqual('Simple Math');
        }
        );

             it('shows the code 2', function() {
            var view = learnjs.problemView('2');
            expect(view.find('[data-name="code"]').text()).toEqual('function problem() {return 42 === 6 * __; }');
        }
        );

    }
    );

    
    describe('answer section', function() {
        it('can check a correct answer by hitting a button', function() {
            var view = learnjs.problemView('1');
            view.find('.answer').val('true');
            view.find('.check-btn').click();
            expect(view.find('.result').text()).toContain('Correct!'); //book didn't address this, but added a button on correct click so changed to contain to account (again white space added too)
        });

        it('rejects an incorrect answer', function() {
            var view = learnjs.problemView('1');
            view.find('.answer').val('false');
            view.find('.check-btn').click();
            expect(view.find('.result').text()).toEqual('Incorrect!');
        });

    });

}
);