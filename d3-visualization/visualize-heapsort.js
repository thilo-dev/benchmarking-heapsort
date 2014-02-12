
(function(){
    HeapTree = function(dat){
        var height = 900,
            width = 1800;
        tree = d3.layout.tree()
            .size([width, height]);
            // .separation(function(a,b){ return (a.parent == b.parent ? 1 : 2);});
        svg = d3.select("body").append("svg")
            .attr('width', width+100)
            .attr('height', height+200)
            .append('g')
                .attr("transform", "translate("+50+","+100+")");

        this.swaps = [];
        // var self = this;

        var nodes  = tree.nodes(dat),
            links = tree.links(nodes);
        console.log(links);



        this.node = svg.selectAll('.node')
            .data(nodes)
            .enter().append("g")
                .attr('class', function(d){return d.class+" node";})
                .attr("transform", function(d) { return "translate(" + d.x +","+d.y+ ")";})
                .attr({
                    _x: function(d){return d.x;},
                    _y: function(d){return d.y;}
                })
                .append("svg:circle")
                    .attr('r', 28);

        d3.selectAll('.node').append("svg:text")
            .text(function(d){ return d.val;})
            .attr('transform', "translate("+-15+","+-10+")")
            .attr('class', 'lable');
        this.link = svg.selectAll(".link")
            .data(links)
            .enter().append("line")
            .attr('class', 'link')
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
    };

    var pro = HeapTree.prototype;

    // i is parent
    // j is child
    pro.findNodes = function(i,j,n){
        var self = this;
        var z = [];

        n.each(function(el, index) {
             if(el.i === j){
                z[1] = [d3.select(".node"+j),el];
            } else if(el.i === i){
                z[0] = [d3.select(".node"+i),el];
            }
        });

        return [z,n];
    };
    //  -------------------------------
    // record swap indexes
    //  -------------------------------
    pro.recordSwap = function(i,j,json){
        // console.log(this.swaps);
        this.swaps.push([i,j,json]);
    };
    // ------------------------------
    // i stands for position in swaps
    // ------------------------------
    pro.replaySwaps = function(i,n){
        if(i<this.swaps.length){
            var self = this;
            var i_n = this.swaps[i][0],
                j_n = this.swaps[i][1];

            var elems = [d3.select('.node'+i_n), d3.select('.node'+j_n)];
            // change node classes
            elems[0].attr('class','node'+j_n);
            elems[1].attr('class','node'+i_n);
            // get new position
            var x0 = elems[0].attr('_x');
            var x1 = elems[1].attr('_x');
            var y0 = elems[0].attr('_y');
            var y1 = elems[1].attr('_y');
            // do the chained transitions
            elems[0].transition()
                .duration(750)
                .attr('transform',"translate("+x1+","+y1+")")
                .attr('_x',x1)
                .attr('_y',y1)
                    .each('end',
                        function(){
                            elems[1].transition()
                                .duration(375)
                                .attr('transform',"translate("+x0+","+y0+")")
                                .attr('_x',x0)
                                .attr('_y',y0)
                                    .each('end', self.replaySwaps(i+1,n));
                        });
        }
    };

    pro.updateTree = function(nodelist){
        var ok = d3.selectAll(".node").remove();
        var z = tree.nodes(nodelist);
        var zz = svg.selectAll('.node')
            .data(z)
            .enter().append("g")
                .attr('class', function(d){return d.class +" node";})
                .attr("transform", function(d) { return "translate(" + d.x +","+d.y+ ")";})
                .append("svg:text")
                    .text(function(d){ return d.val+" "+Math.floor(Math.random(200)*20);});
        this.node = zz;
    };
        

    return HeapTree;


}());



(function(){
    MaxHeap = function(size){
        this.size = size;
		this.x = [0];
        this.dat = {
            "name": "root"
        };
        this.pointer = this.dat;
        // this.tree = new HeapTree();
        // initialize with random values
        for (var i = 0; i<size; i++){
            this.x.push(Math.round(Math.random()*400));
        }

    };
    // shorthand for further creation of public functions
    var pro = MaxHeap.prototype;
    // -----------------------------------------
    // sort heap by exchanging heap root with last 
    // element and heapify the heap again
    // --> array is sorted ascending at the end
    // -----------------------------------------
    pro.heapsort = function(){
       for(var i = this.size; i>=1;i--){
            var help = this.x[1];
            this.x[1] = this.x[i];
            this.x[i] = help;
            this.size = this.size-1;
            this.heapify(1);
        }
    };
    // -----------------------------------------
    // build initial heap function
    // -----------------------------------------
    pro.buildHeap = function(){
        for(var i = Math.floor(this.size/2); i>=1; i--){
            this.heapify(i);
        }
    };

    // -----------------------------------------
    // recursively called function
    // build json for heap visualization starting from i = 1 for first call
    // -----------------------------------------
    pro.buildJson = function(i, pointer){
        // is there a left child in the tree? add child array
        if(i === 1){
            this.dat.val = this.x[i];
            this.dat.i = 1;
            this.dat.class="node1";
        }

        if(left(i)<=this.size){
           pointer.children = [];
        }
        // handle left child and call recursively
        if(left(i)<=this.size){
            pointer.children.push(
                {
                    'val': this.x[left(i)],
                    "i" : left(i),
                    "class": "node"+left(i)
                }
            );
            this.buildJson(left(i), pointer.children[0]);
        }
        // same for the right child
        if(right(i)<=this.size){
            pointer.children.push(
                {
                    'val': this.x[right(i)],
                    "i" : right(i),
                    "class": "node"+right(i)
                }
            );
            this.buildJson(right(i), pointer.children[1]);
        }
    };
    // -----------------------------------------
    // heapify per node
    // -----------------------------------------
    pro.heapify = function(i){
        // console.log(i);
        var largest;
        // init sons
        var l = left(i);
        var r = right(i);
        // is left son bigger
        largest = (l<=this.size && this.x[l] > this.x[i]) ? l : i;
        // is right son bigger
        largest = (r<=this.size && this.x[r] > this.x[largest]) ? r : largest;
        // exchange neccesary!
        if(largest !== i){
            this.switchNode(i,largest);
            var self = this;
            this.tree.recordSwap(i,largest,self.dat);
            this.heapify(largest);
        }
    };
    //----------------------
    // switch nodes
    pro.switchNode = function(i,j){
        var help = this.x[i];
        this.x[i] = this.x[j];
        this.x[j] = help;
    };

    pro.buildTree = function(){
        this.buildJson(1, this.pointer);
        this.tree = new HeapTree(this.dat);
    };
    // privat functions
    // find depth of tree
    var depthFind = function(size){
        var i = 1, x = 0;
        while(left(i)<size){
            x++;
            i = left(i);
        }
        return x;
    };

    var left = function(i){
        return 2*i;
    };
    var right = function(i){
        return (2*i)+1;
    };
    var parent = function(i){
        return Math.round(i/2);
    };
    return MaxHeap;
    
}());

var heap = new MaxHeap(31);
// 
heap.buildTree();
heap.buildHeap();
console.log(heap);
heap.tree.replaySwaps(0,heap.tree.node);
console.log(heap.dat);



