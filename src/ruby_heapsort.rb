# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

# puts "Hello World"

class MaxHeap
  def init_heap(size)
    @size = size
    @x = [0]
    for i in 0..size
      @x.push(Random.new.rand(16000000))
    end
    #print @x
  end
  def heapify(i)
    largest = 0
    l = 2*i
    r = (2*i)+1
    if l<=@size and @x[l]>@x[i]
      largest = l
    else
      largest = i
    end
    if r<=@size and @x[r]>@x[largest]
      largest = r
    end
    if largest != i
      help = @x[i]
      @x[i] = @x[largest]
      @x[largest] = help
      heapify(largest)
    end
  end
  
  def build_heap
    for i in (@size/2).downto(1)
      heapify(i)
    end
    #print @x
  end
  
  def sort
    for i in @size.downto(2)
      help = @x[1]
      @x[1] = @x[i]
      @x[i] = help
      @size -=1
      heapify(1)
    end
    #print @x
  end
end

heap = MaxHeap.new()
start = Time.now
heap.init_heap(1000000)
mid = Time.now
heap.build_heap
mid1 = Time.now
heap.sort
fin = Time.now
puts "total: "+(fin-start).to_s
puts "generate numbers: "+ (mid-start).to_s
puts "build tree: "+(mid1-mid).to_s
puts "sort: "+(fin-mid1).to_s

